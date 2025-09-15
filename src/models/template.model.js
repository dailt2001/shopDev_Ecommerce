import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "template";
const COLLECTION_NAME = "templates";

const templateSchema = new Schema(
    {
        tem_id: { type: Number, require: true },
        tem_name: { type: String, require: true },
        tem_status: { type: String, default: 'active' },
        tem_html: { type: String, require: true },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

export default model(DOCUMENT_NAME, templateSchema);
