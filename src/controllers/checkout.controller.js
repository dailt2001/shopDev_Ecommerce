import { SuccessResponse } from "../core/success.response.js";
import CheckoutService from "../services/checkout.service.js";

class CheckoutController{

    checkoutReview  = async (req, res, next) => {
        new SuccessResponse({
            message: "Checkout cart Successfully!", 
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    };

}

export default new CheckoutController();
