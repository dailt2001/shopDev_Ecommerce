import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";
// Declare the Schema of the Mongo model
const inventorySchema = new Schema(
    {
        inven_productId: { type: Schema.Types.ObjectId, ref: "Product" },
        inven_location: { type: String, default: "unKnow" },
        inven_stock: { type: Number, required: true },
        inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
        inven_reservations: { type: Array, default: [] },
        //    { cartId:,
        //      stock: 1,
        //     created0n:}
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

//Export the model
export default model(DOCUMENT_NAME, inventorySchema);
