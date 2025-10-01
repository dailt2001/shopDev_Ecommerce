import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Sku";
const COLLECTION_NAME = "skus";

const skuSchema = new Schema(
    {
        sku_id: { type: String, require: true, unique: true },
        sku_tier_index: { type: Array, default: [0] },
        // color: ['red', 'blue'] = [0, 1]
        // size: ['M', 'L'] = [0, 1]
        // red + M = [0, 0]
        sku_default: { type: Boolean, default: false },
        sku_slug: { type: String, default: "" },
        sku_sort: { type: Number, default: 0 },
        sku_price: { type: String, require: true },
        sku_stock: { type: Number, default: 0 }, // more detail is Array
        product_id: { type: String, ref: "Spu", require: true },

        isDraft: { type: Boolean, default: false, index: true, select: false },
        isPublished: {
            type: Boolean,
            default: true,
            index: true,
            select: false,
        },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

export default model(DOCUMENT_NAME, skuSchema);
