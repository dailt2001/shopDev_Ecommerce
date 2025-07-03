import {Schema, model, Types} from "mongoose";

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'
//!dmgb
// Declare the Schema of the Mongo model
const shopSchema = new Schema({
    name:{
        type:String,
        trim: true,
        maxLength: 150
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    status:{
        type:String,
        enum:['active', 'inactive'],
        default:'inactive',
    },
    password:{
        type:String,
        required:true,
    },
    verify:{
        type:Schema.Types.Boolean,
        default:false,
    },
    roles:{
        type: Array,
        default:[],
    },
}, {
    timestamps: true,
    collection:COLLECTION_NAME,
});

//Export the model
export default model(DOCUMENT_NAME, shopSchema);