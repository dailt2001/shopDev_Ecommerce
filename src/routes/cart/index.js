import express from 'express'
import cartController from '../../controllers/cart.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'


const cartRouter = express.Router()

cartRouter.delete('/delete', asyncHandler(cartController.deleteCart))
cartRouter.post('/add', asyncHandler(cartController.addToCart))
cartRouter.post('/update', asyncHandler(cartController.updateQuantity))
cartRouter.get('', asyncHandler(cartController.getListCart))

export default cartRouter