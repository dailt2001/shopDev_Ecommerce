import Notification from "../models/notification.model.js";
import { BadRequestError, NotFound } from "../core/error.response.js";

class NotificationService {
    static async pushNotiToSystem({ type = "SHOP-001", receivedId = 1, senderId = 1, options = {} }) {
        let noti_content;
        if (type === "SHOP-001") {
            noti_content = `@@@ vùa mói thêm môt san pham: @@@@`;
        } else if (type === "PROMOTION-001") {
            noti_content = `@@@ vùa mói thêm môt voucher: @@@@@ `;
        }
        const newNoti = await Notification.create({
            noti_type: type,
            noti_content,
            noti_senderId: senderId,
            noti_receivedId: receivedId,
            noti_options: options,
        });
        return newNoti;
    }

    static async listNotiByUser({ userId = 1, type = "ALL", isRead = 0 }) {
        const match = { noti_receivedId: userId };
        if (type !== "ALL") match["noti_type"] = type;
        return await Notification.aggregate([
            { $match: match },
            {
                $project: {
                    noti_type: 1,
                    noti_senderId: 1,
                    noti_receivedId: 1,
                    noti_content: 1,
                    noti_options: 1,
                    createAt: 1,
                },
            },
        ]);
    }
}

export default NotificationService;
