import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import userController from '../../controllers/user.controller.js'


const userRouter = express.Router()

userRouter.post('/new_user', asyncHandler(userController.newUser))
userRouter.get('/welcome-back', asyncHandler(userController.checkLoginEmailToken))

export default userRouter