import { convertToObjectIdMongodb, getSelectData, getUnSelectData } from "../../utils/index.js";
import { product, clothing, furniture, electronic } from "../../models/product.model.js";
import { Types } from "mongoose";

const queryProduct = async ({ query, skip, limit }) => {
    return await product
        .find(query)
        .populate("product_shop", "name email -_id")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
};

export const findAllDraftsForShop = async ({ query, skip, limit }) => {
    return await queryProduct({ query, skip, limit });
};

export const findAllPublishForShop = async ({ query, skip, limit }) => {
    return await queryProduct({ query, skip, limit });
};

export const publishProductByShop = async (product_shop, product_id) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    });
    if (!foundShop) return null;
    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const saved = await foundShop.save();
    return saved;
};

export const unPublishProductByShop = async (product_shop, product_id) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    });
    if (!foundShop) return null;
    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const saved = await foundShop.save();
    return saved;
};

export const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const result = await product
        .find(
            {
                isPublished: true,
                $text: { $search: regexSearch },
            },
            { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .lean();
    return result;
};

export const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    return await product.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean();
};

export const findProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id).select(getUnSelectData(unSelect)).lean();
};

export const updateProductById = async ({ productId, body, model }) => {
    return await model.findByIdAndUpdate(productId, body, { new: true });
};

export const getProductById = async(productId) => {
    return await product.findOne({_id: convertToObjectIdMongodb(productId)}).lean()
}
