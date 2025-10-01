import { model,Schema} from 'mongoose'

const DOCUMENT_NAME = 'Resource'
const COLLECTION_NAME = 'Resources'

const resourceSchema = new Schema({
    resource_description: { type: String, required: true}, 
    resource_slug: { type: String, required: true}, // 0001
    resource_name: { type: String, default: ""} //profile
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

export default model(DOCUMENT_NAME, resourceSchema)
   
