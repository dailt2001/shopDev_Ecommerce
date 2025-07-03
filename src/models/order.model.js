import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";
// Declare the Schema of the Mongo model
var orderSchema = new Schema(
    {
        order_userId: { type: Number, required: true },
        order_checkout: { type: Object, default: {} },
        // order_checkout =
        //  {
        // totalPrice,
        // totalApllyDiscount
        // feeShip
        //}

        order_shipping: { type: Object, default: {} },
        // street,
        // city,
        // state,
        // country
        order_payment: { type: Object, default: {} },
        order_products: { type: Array, required: true },
        order_trackingNumber: { type: String, default: "#0000118052022" },
        order_status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
            default: "pending",
        },
    },
    {
        collection: COLLECTION_NAME,
        timeseries: {
            createdAt: "createdOn",
            updatedAt: "modifiedOn",
        },
    }
);

//Export the model
export default model(DOCUMENT_NAME, orderSchema);
