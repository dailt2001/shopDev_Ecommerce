import order from "../models/order.model.js";
import cart from "../models/cart.model.js"
import { BadRequestError, NotFound } from "../core/error.response.js";
import { checkProductByServer, findCartById, validateCartWithPayload } from "../models/repository/checkout.repo.js";
import { DiscountService } from "./discount.service.js";
import { acquireLock, releaseLock } from "./redis.service.js";

class CheckoutService {
    // {
    //     cartId,
    //     userId
    //     shop_order_ids: [
    //     {
    //          shopId1, shopDiscounts:[
    //             {
    //                 "shopId","code","discountId"
    //             }
    //         ], item_products: [
    //             {
    //                 producId, price, quantity
    //             }
    //         ]
    //     },... { shopId 2}
    // ]}
    static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
        const foundCart = await findCartById(cartId);
        if (!foundCart) throw new NotFound("Cart does not exist !!");

        // const validateProducts = validateCartWithPayload({ foundCart, shop_order_ids })
        // if(!validateProducts) throw new BadRequestError("Cart and order do not match!");

        const checkoutOrder = { totalPrice: 0, feeShip: 0, totalDiscount: 0, totalCheckout: 0 },
            shop_order_ids_new = [];
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts, item_products } = shop_order_ids[i];
            //check product available
            const checkProductServer = await checkProductByServer(item_products);
            console.log("checkProductServer::", checkProductServer);
            if (!checkProductServer[0]) throw new BadRequestError("Order wrong!!");
            //tong tien
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.price * product.quantity)
            }, 0);
            checkoutOrder.totalPrice += checkoutPrice

            const checkoutItem = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }
            //neu shop_discounts ton tai > 0, check xem hop le
            if(shop_discounts.length > 0) {
                //gia su co 1 discount
                const { totalPrice = 0, discount = 0 } = await DiscountService.getDiscountAmount({
                    code: shop_discounts[0].code,
                    userId, shopId,
                    products: checkProductServer
                })
                checkoutOrder.totalDiscount += discount // tong discount giam gia
                if(discount > 0){
                    checkoutItem.priceApplyDiscount = checkoutPrice - discount
                }
            }
            // tong thanh toan cuoi cung
            checkoutOrder.totalCheckout += checkoutItem.priceApplyDiscount
            shop_order_ids_new.push(checkoutItem)
        }

        return {
            shop_order_ids,
            shop_order_ids_new, checkoutOrder
        }
    }
    
    static async orderByUser({
        shop_order_ids,
        userId, cartId,
        address = {}, payment = {}
    }){
        const { shop_order_ids_new, checkoutOrder } = await CheckoutService.checkoutReview({userId, cartId, shop_order_ids: shop_order_ids })
        //check lai xem vuot ton kho
        //get new array product
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log("products", products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i]
            const keyLock = await acquireLock(productId, quantity, cartId )
            acquireProduct.push(keyLock ? true : false)
            if(keyLock) await releaseLock(keyLock, cartId)
        }
        // neu co 1 san pham het hang trong kho
        if(acquireProduct.includes(false)) throw new BadRequestError("Mot so san pham da duoc cap nhat vui long quay lai gio hang!")
        
        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkoutOrder,
            order_shipping: address,
            order_payment: payment,
            order_products: shop_order_ids_new
        })
        // insert thanh cong ===> xoa gio hang
        if(newOrder){
            await cart.deleteOne({ userId, _id: cartId })
        }
        return newOrder
    }

    static async getOrderByUser(){
    }

    static async getAllOrdersByUser(){
    }

    static async cancelOrder(){
    }
    //update order status (shop || admin)
    static async updateOrderStatusByShop(){     
    }
}

export default CheckoutService;
