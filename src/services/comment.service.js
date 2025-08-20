import { convertToObjectIdMongodb } from "../utils/index.js";
import Comment from "../models/comment.model.js";
import { NotFound } from "../core/error.response.js";

class CommentService {
    static async createComment({ productId, userId, content, commentParentId = null }) {
        const comment = new Comment({
            comment_content: content,
            comment_productId: productId,
            comment_userId: userId,
            comment_parentId: commentParentId,
        });
        let rightValue;
        if (commentParentId) {
            //reply comment
            const parentComment = await Comment.findById(commentParentId);
            if (!parentComment) throw new NotFound("Not found Parent Comment!");
            rightValue = parentComment.comment_right
            await Comment.updateMany({ comment_productId: convertToObjectIdMongodb(productId), comment_right: { $gte: rightValue}}, {
                $inc: { comment_right: 2 }
            })

            await Comment.updateMany({ comment_productId: convertToObjectIdMongodb(productId), comment_left: { $gt: rightValue}}, {
                $inc: { comment_left: 2 }
            })
            //insert 
            comment.comment_left = rightValue;
            comment.comment_right = rightValue + 1;
            await comment.save();
            return comment;
        } else {
            const maxRightValue = await Comment.findOne(
                { comment_productId: convertToObjectIdMongodb(productId) },
                "comment_right",
                { sort: { comment_right: -1 } }
            );
            //maxRightValue = { comment_right : max}
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1;
            } else {
                rightValue = 1;
            }
            //insert
            comment.comment_left = rightValue;
            comment.comment_right = rightValue + 1;
            await comment.save();
            return comment;
        }
    }
    static async getCommentByParentId({ productId, parentCommentId = null, limit = 50, offset = 0 }) {
        if(parentCommentId){
            const parent = await Comment.findById(convertToObjectIdMongodb(parentCommentId))
            if(!parent) throw new NotFound("Not found comment for Product")
            
            const comments = await Comment.find({ comment_productId: convertToObjectIdMongodb(productId), comment_left: {$gt: parent.comment_left}, comment_right: {$lt: parent.comment_right}}).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1,
            }).sort({ comment_left: 1 })

            return comments
        }

        const comments = await Comment.find({ comment_productId: convertToObjectIdMongodb(productId), comment_parentId: null}).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1,
            }).sort({ comment_left: 1 })

            return comments
    }
    static async deleteComments({ commentId, productId }){
        const comment = await Comment.findOne({ _id: convertToObjectIdMongodb(commentId),comment_productId: convertToObjectIdMongodb(productId)})
        if(!comment) throw new NotFound("Not found comment!")
        const { comment_left, comment_right } = comment
        const width = comment_right - comment_left + 1

        const deletedComments = await Comment.deleteMany({ comment_productId: convertToObjectIdMongodb(productId),comment_left: { $gte: comment_left}, comment_right: { $lte: comment_right }})

        await Comment.updateMany({ comment_productId: convertToObjectIdMongodb(productId), comment_right: { $gt: comment_right }},{ $inc: { comment_right: -width }})

        await Comment.updateMany({ comment_productId: convertToObjectIdMongodb(productId), comment_left: {$gt: comment_right}}, { $inc: { comment_left: -width }})

        return deletedComments
    }
}

export default CommentService;
