import { DiscountService } from "../services/discount.service.js"
import { SuccessResponse } from "../core/success.response.js"


class DiscountController {
    createDiscount = async(req, res, next) => {
        new SuccessResponse({
            message: "Create Discount code Successfully!",
            metadata: await DiscountService.createDiscountCode({ ...req.body, shopId: req.user.userId })
        }).send(res)
    }

    getAllDiscountCodes = async(req, res, next) => {
        new SuccessResponse({
            message: "Get all Discount codes Successfully!",
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodesWithProduct = async(req, res, next) => {
        new SuccessResponse({
            message: "Get all Products with code Successfully!",
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query
            })
        }).send(res)
    }

    getDiscountAmount = async(req, res, next) => {
        new SuccessResponse({
            message: "Get Discount amount Successfully!",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

    deleteDiscountCode = async(req, res, next) => {
        new SuccessResponse({
            message: "Delete discount code Successfully!",
            metadata: await DiscountService.deleteDiscountCode({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    cancelDiscountCode = async(req, res, next) => {
        new SuccessResponse({
            message: "Cancel discount code Successfully!",
            metadata: await DiscountService.cancelDiscountCode({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }
}

export default new DiscountController()