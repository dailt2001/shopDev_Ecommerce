
import express from "express"
import { asyncHandler } from "../../helpers/asyncHandler.js"
import { authentication } from "../../utils/Auth.js"
import notificationController from "../../controllers/notification.controller.js"

const notificationRouter = express.Router()

notificationRouter.use(authentication)
notificationRouter.get("", asyncHandler(notificationController.listNotiByUser))

export default notificationRouter