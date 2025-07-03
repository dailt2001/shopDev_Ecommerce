import express from 'express'
import { authentication } from '../../utils/Auth.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import discountController from '../../controllers/discount.controller.js'

const discountRouter = express.Router()

discountRouter.post('/amount', asyncHandler(discountController.getDiscountAmount))
discountRouter.get('/list_products_code', asyncHandler(discountController.getAllDiscountCodesWithProduct))

discountRouter.use(authentication)
discountRouter.post('/create', asyncHandler(discountController.createDiscount))
discountRouter.get('/all', asyncHandler(discountController.getAllDiscountCodes))

export default discountRouter