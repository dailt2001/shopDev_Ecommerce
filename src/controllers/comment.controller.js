import { SuccessResponse } from "../core/success.response.js"
import CommentService from "../services/comment.service.js"


class CommentController{
    createComment = async(req, res,next) => {
        new SuccessResponse({
            message: "Create comment successfully!",
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }

    getCommentsByParentId= async(req, res,next) => {
        new SuccessResponse({
            message: "Get comments successfully!",
            metadata: await CommentService.getCommentByParentId(req.body)
        }).send(res)
    }

    deleteComments= async(req, res,next) => {
        new SuccessResponse({
            message: "Delete comments successfully!",
            metadata: await CommentService.deleteComments(req.body)
        }).send(res)
    }
}

export default new CommentController