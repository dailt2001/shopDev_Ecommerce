import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { authentication } from '../../utils/Auth.js'
import checkoutController from '../../controllers/checkout.controller.js'

const checkoutRouter = express.Router()

checkoutRouter.post('/review', asyncHandler(checkoutController.checkoutReview))

checkoutRouter.use(authentication)

checkoutRouter.post('/order', asyncHandler(checkoutController.orderByUser))

//authentication


export default checkoutRouter