import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "otp_log";
const COLLECTION_NAME = "otp_logs";

const otpSchema = new Schema(
    {
       otp_token: { type: String, require: true },
       otp_email: { type: String, require: true },
       otp_status: { type: String, default: 'pending', enum: ['block', 'pending', 'active']},
       expireAt: { type: Date, default: Date.now, expires: 300 }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

export default model(DOCUMENT_NAME, otpSchema);
