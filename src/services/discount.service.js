import discount from "../models/discount.model.js";
import { BadRequestError, NotFound } from "../core/error.response.js";
import { convertToObjectIdMongodb } from "../utils/index.js";
import { findAllProducts } from "../models/repository/product.repo.js";
import { checkDiscountExist, findAllDiscountCodesUnselect } from "../models/repository/discount.repo.js";

export class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user,
            users_used,
        } = payload;
        // kiem tra
        // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
        //     throw new BadRequestError("Discount code has expired!");
        // }
        if (new Date(start_date) >= new Date(end_date))
            throw new BadRequestError("Start date must be before End date!");
        //create index for discount code
        const foundDiscountCode = await discount
            .findOne({
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            })
            .lean();
        if (foundDiscountCode && foundDiscountCode.discount_is_active) throw new BadRequestError("Discount exist!!");

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_shopId: shopId,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === "all" ? [] : product_ids,
        });
        return newDiscount;
    }

    static async getAllDiscountCodesWithProduct({ shopId, code, limit, page }) {
        // code =>> products
        const foundDiscountCode = await discount
            .findOne({
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            })
            .lean();
        if (!foundDiscountCode && !foundDiscountCode.discount_is_active) throw new NotFound("Discount not exist!!");
        const { discount_applies_to, discount_product_ids } = foundDiscountCode;
        let products = ["1"];
        if (discount_applies_to === "all") {
            products = await findAllProducts({
                filter: {
                    product_shop: shopId,
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            });
        }
        if (discount_applies_to === "specific") {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            });
        }

        return products;
    }
    static async getAllDiscountCodesByShop({ limit, page, shopId }) {
        //shop =>> codes
        const discounts = await findAllDiscountCodesUnselect({
            limit: +limit,
            page: +page,
            filter: { discount_shopId: shopId },
            unSelect: ["__v", "discount_shopId"],
            model: discount,
        });
        return discounts;
    }
    static async getDiscountAmount({ code, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExist({
            model: discount,
            filter: {
                discount_code: code,
                discount_shopId: shopId,
            },
        });
        if (!foundDiscount) throw new NotFound("Discount does not exist!");

        const {
            discount_is_active,
            discount_max_uses,
            discount_end_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value,
        } = foundDiscount;

        if (!discount_is_active) throw new BadRequestError("Discount expired!");
        if (!discount_max_uses) throw new BadRequestError("Discount are out!");
        // if (new Date(discount_end_date) < new Date()) throw new BadRequestError("Discount expired!");
        //get total
        let totalOrder = 0;
        if (discount_min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + product.quantity * product.price;
            }, 0);
            if (totalOrder < discount_min_order_value)
                throw new BadRequestError(`Discount requires a minimum of order value of ${discount_min_order_value}`);
        }

        if (discount_max_uses_per_user > 0) {
            const userUseDiscount = discount_users_used.find((user) => user.userId === userId);
            if (userUseDiscount) {
                if (userUseDiscount.uses >= discount_max_uses_per_user) {
                    throw new BadRequestError("Maximum number of times Used!");
                } else {
                    userUseDiscount.uses += 1;
                }
            } else {
                // first time use
                discount_users_used.push({ userId, uses: 1 });
            }
            await foundDiscount.save()
        }

        // check fixed amount or percentage
        const amount = discount_type === "fixed_amount" ? discount_value : totalOrder * (discount_value / 100);
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        };
    }
    static async deleteDiscountCode({ code, shopId }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
        });
        return deleted;
    }
    static async cancelDiscountCode({ code, shopId }) {
        const foundDiscount = await checkDiscountExist({
            model: discount,
            filter: {
                discount_code: code,
                discount_shopId: shopId,
            },
        });
        if (!foundDiscount) throw new NotFound("Discount not exist!!");
        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: { discount_users_used: userId },
            $inc: { discount_max_uses: 1, discount_uses_count: -1 },
        });
        return result;
    }
}
