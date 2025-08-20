import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "notifications";
// Declare the Schema of the Mongo model
var notificationSchema = new Schema(
    {
        noti_type: { type: String, enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"], required: true },
        noti_senderId: { type: Schema.Types.ObjectId, required: true, ref: "Shop" },
        noti_receivedId: { type: Number, required: true },
        noti_content: { type: String, required: true },
        noti_options: { type: Object, default: {} },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

//Export the model
export default model(DOCUMENT_NAME, notificationSchema);
