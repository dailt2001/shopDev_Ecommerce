import { SuccessResponse } from "../core/success.response.js"
import NotificationService from "../services/notification.service.js"


class NotificationController{
    listNotiByUser = async(req, res,next) => {
        new SuccessResponse({
            message: "Get list notification successfully!",
            metadata: await NotificationService.listNotiByUser(req.query)
        }).send(res)
    }
}

export default new NotificationController