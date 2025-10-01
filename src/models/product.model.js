import { model, Schema } from "mongoose";
import slugify from "slugify";

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";
// Declare the Schema of the Mongo model
const productSchema = new Schema(
    {
        product_name: {
            type: String,
            required: true,
            unique: true,
        },
        product_thumb: {
            type: String,
            required: true,
        },
        product_description: String,
        product_slug: String,
        product_price: {
            type: Number,
            required: true,
        },
        product_quantity: {
            type: Number,
            required: true,
        },
        product_type: {
            type: String,
            required: true,
            enum: ["Electronics", "Clothing", "Furniture"],
        },
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop", // document name
        },
        product_attributes: {
            type: Schema.Types.Mixed,
            required: true,
        },
        product_ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be above 5.0"],
            set: (val) => Math.round(val * 10) / 10,
        },
        product_variations: { type: Array, default: [] },
        isDraft: { type: Boolean, default: false, index: true, select: false },
        isPublished: {
            type: Boolean,
            default: true,
            index: true,
            select: false,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

//create index for search
productSchema.index({ product_name: 'text', product_description: 'text' })

//Document middleware runs before .save() and ,create()
productSchema.pre('save', function( next ){
    this.product_slug = slugify(this.product_name, {lower: true})
    next()
})

//define the product of type clothing
const clothingSchema = new Schema(
    {
        brand: {
            type: String,
            required: true,
        },
        size: String,
        material: String,
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop", // document name
        },
    },
    {
        collection: "clothes",
        timestamps: true,
    }
);
//define the product of type electronics
const electronicSchema = new Schema(
    {
        manufacturer: {
            type: String,
            required: true,
        },
        model: String,
        color: String,
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop", // document name
        },
    },
    {
        collection: "electronics",
        timestamps: true,
    }
);
const furnitureSchema = new Schema(
    {
        brand: {
            type: String,
            required: true,
        },
        size: String,
        material: String,
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop", // document name
        },
    },
    {
        collection: "furniture",
        timestamps: true,
    }
);
//Export the model
export const product = model(DOCUMENT_NAME, productSchema);
export const furniture = model("Furniture", furnitureSchema);
export const electronic = model("Electronics", electronicSchema);
export const clothing = model("Clothing", clothingSchema);
