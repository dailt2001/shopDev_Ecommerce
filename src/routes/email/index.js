import express from 'express'
import emailController from '../../controllers/email.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'


const emailRouter = express.Router()

emailRouter.post('/new_template', asyncHandler(emailController.newTemplate))

export default emailRouter