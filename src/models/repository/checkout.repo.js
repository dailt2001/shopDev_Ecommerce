import { convertToObjectIdMongodb } from "../../utils/index.js"
import cart from "../cart.model.js"
import { getProductById } from "./product.repo.js"
import { BadRequestError } from "../../core/error.response.js"

export const findCartById = async(cartId) => {
    return await cart.findOne({_id: convertToObjectIdMongodb(cartId), cart_state: "active"}).lean()
}

export const checkProductByServer = async(products) => {
    return await Promise.all( products.map(async product => {
        const foundProduct = await getProductById(product.productId)
        if(foundProduct) {
            return {
                name: foundProduct.product_name,
                price: foundProduct.product_price,
                quantity:product.quantity,
                productId: product.productId
            }
        }
    }))
}

export const validateCartWithPayload = ({ cart, shop_order_ids = [] }) => {
    const cartProducts = cart.cart_products.map(p => ({ 
        productId: p.productId.toString(),
        quantity: p.quantity
    }))

    const payloadProducts = shop_order_ids.flatMap(shop => {
        shop.item_products.map(p => ({
            productId: p.productId.toString(),
            quantity: p.quantity
        }))
    })

    for(let p of payloadProducts){
        const inCart = cartProducts.find(c => c.productId === p.productId)
        if(!inCart) throw new BadRequestError(`Product ${p.productId} not in cart`);
        if(p.quantity !== inCart.quantity) throw new BadRequestError(`Invalid quantity for product ${p.productId}`);
    }
    return true
}