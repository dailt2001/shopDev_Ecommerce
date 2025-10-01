import { model, Schema } from "mongoose";
import slugify from "slugify";

const DOCUMENT_NAME = "Spu";
const COLLECTION_NAME = "spus";
// Declare the Schema of the Mongo model
const spuSchema = new Schema(
    {
        product_id: {
            type: String,
            default: "",
        },
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
        product_category: {
            type: Array,
            default: [],
        },
        // product_type: {
        //     type: String,
        //     required: true,
        //     enum: ["Electronics", "Clothing", "Furniture"],
        // },
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop", // document name
        },
        product_attributes: {
            type: Schema.Types.Mixed,
            required: true,
        },
        /* 
        {
            attributes_id: 12434213, eg: style ao: han quoc,mua he,mat me
            attributes_values: [
                {
                    value_id: 1333212,
                },...
            ]
        }
        */
        product_ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be above 5.0"],
            set: (val) => Math.round(val * 10) / 10,
        },
        product_variations: { type: Array, default: [] },
        /* 
        variation_tier: [
            {
                image: [],
                name: 'color',
                options: ['red', 'blue', ....]
            },{
                image: [],
                name: 'size',
                options: ['M', 'L', ....]
            }, ......
        ]
        */

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
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

//create index for search
spuSchema.index({ product_name: "text", product_description: "text" });

//Document middleware runs before .save() and ,create()
spuSchema.pre("save", function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

export default model(DOCUMENT_NAME, spuSchema);
