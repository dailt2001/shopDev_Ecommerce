import commentController from "../../controllers/comment.controller.js"
import express from "express"
import { asyncHandler } from "../../helpers/asyncHandler.js"
import { authentication } from "../../utils/Auth.js"

const commentRouter = express.Router()
commentRouter.use(authentication)
commentRouter.post("", asyncHandler(commentController.createComment))
commentRouter.get("", asyncHandler(commentController.getCommentsByParentId))
commentRouter.delete("", asyncHandler(commentController.deleteComments))

export default commentRouter