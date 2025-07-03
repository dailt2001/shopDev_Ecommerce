import { SuccessResponse } from "../core/success.response.js";
import CartService from "../services/cart.service.js";

class CartController {
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new cart Successfully!",
            metadata: await CartService.addToCart(req.body),
        }).send(res);
    };
    updateQuantity = async (req, res, next) => {
        new SuccessResponse({
            message: "Update cart Successfully!",
            metadata: await CartService.addToCartV2(req.body),
        }).send(res);
    };
    deleteCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete cart Successfully!",
            metadata: await CartService.deleteUserCart(req.body),
        }).send(res);
    };
    getListCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list cart Successfully!",
            metadata: await CartService.getListCart(req.query),
        }).send(res);
    };
}

export default new CartController();
