
import { model,Schema } from "mongoose";

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKeys'
// Declare the Schema of the Mongo model
const apikeySchema = new Schema({
    key:{
        type: String,
        required:true,
        unique: true
    },
    status:{
        type: Boolean,
        default:true,
    },
    permissions:{
        type:[String],
        required:true,
        enum: ['0000', '1111', '2222']
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
export default model(DOCUMENT_NAME, apikeySchema);