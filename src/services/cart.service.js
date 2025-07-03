import { getProductById } from "../models/repository/product.repo.js";
import cart from "../models/cart.model.js";
import { BadRequestError, NotFound } from "../core/error.response.js";

class CartService{
    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: "active" },
            createOrInsert = {
                $addToSet: {
                    cart_products: product,
                },
            },
            options = { new: true, upsert: true };
        return await cart.findOneAndUpdate(query, createOrInsert, options);
    }
    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product;
        const query = { cart_userId: userId, cart_state: "active", "cart_products.productId": productId },
            updateSet = {
                $inc: {
                    "cart_products.$.quantity": quantity,
                },
            },
            options = { new: true };
        return await cart.findOneAndUpdate(query, updateSet, options);
    }
    static async deleteUserCart({ userId, productId }){
        console.log('qqqq', {userId, productId})
        const query = { cart_userId: userId, cart_state: "active" }, updateSet = {
            $pull: {
                cart_products: { productId }
            }
        }
        return await cart.updateOne(query, updateSet)
    }
    

    static async addToCart({ userId, product = {} }) {
        const userCart = await cart.findOne({ cart_userId: userId });
        if (!userCart) {
            return await CartService.createUserCart({ userId, product });
        }
        //da co gio hang nhung chua co product
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]; 
            await userCart.save();
        }
        //da co product ===> add quantity
        return CartService.updateUserCartQuantity({ userId, product });
    }

    //increase or decrease quantity
    // update cart
    /*
    shop_order_ids: [
        {
        shopId,
        item_products: [{
            quantity,
            price,
            shopId,
            old_quantity:,
            productId
        }],
        version
    ]  */
    static async addToCartV2({ userId, shop_order_ids }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        const foundProduct = await getProductById(productId)
        if(!foundProduct) throw new NotFound("Not Found Product!!")
        
        const { shopId } = shop_order_ids[0]
        console.log('id::', {shopId, foundProduct})
        if(foundProduct.product_shop.toString() !== shopId) throw new BadRequestError("Product do not be long to the shop!!")

        if(quantity === 0){
            await CartService.deleteUserCart({ userId, productId })
        }
        return await CartService.updateUserCartQuantity({ userId, product : { productId, quantity: quantity - old_quantity } })
    }

    static async getListCart({ userId }){
        return await cart.findOne({ cart_userId: userId})
    }
    
}

export default CartService;
