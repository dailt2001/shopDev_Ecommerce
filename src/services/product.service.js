import { findAllDraftsForShop, publishProductByShop, findAllPublishForShop, unPublishProductByShop, searchProductByUser, findAllProducts, findProduct, updateProductById } from "../models/repository/product.repo.js";
import { BadRequestError } from "../core/error.response.js";
import { product, clothing, electronic, furniture } from "../models/product.model.js";
import { updateNestedObjectParser } from "../utils/index.js";
import { insertInventory } from "../models/repository/inventory.repo.js";

export default class ProductFactory {

    static productRegistry = {}

    static registerProductType(type, classRef){
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).createProduct()
        // lv 1
        // switch(type) {
        //     case "Clothing": 
        //         return new Clothing(payload).createProduct()
        //     case "Electronics":
        //         return new Electronics(payload).createProduct()
        //     default: 
        //         throw new BadRequestError(`Invalid Product Types ${type}`)
        // }
    }

     static async updateProduct(type, payload, productId) {
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).updateProduct(productId)
    }
    //PUT
    static async publishProductByShop(product_shop, product_id){
        return await publishProductByShop(product_shop, product_id)
    }
    static async unPublishProductByShop(product_shop, product_id){
        return await unPublishProductByShop(product_shop, product_id)
    }


    //query
    static async findAllDraftsForShop({ product_shop, skip = 0, limit = 50 }){
        const query = { product_shop, isDraft: true}
        return await findAllDraftsForShop({query, skip , limit})
    }
     static async findAllPublishForShop({ product_shop, skip = 0, limit = 50 }){
        const query = { product_shop, isPublished: true}
        return await findAllPublishForShop({query, skip , limit})
    }

    static async searchProducts({keySearch}){
        return await searchProductByUser({ keySearch })
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }){
        return await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb', "product_shop"] })
    }

    static async findProduct({ product_id }){
        return await findProduct({ product_id, unSelect: ['__v']})
    }
}

class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_shop,
        product_quantity,
        product_type,
        product_attributes,
    }) {
            this.product_name = product_name
            this.product_thumb = product_thumb
            this.product_description = product_description
            this.product_price = product_price
            this.product_shop = product_shop
            this.product_quantity = product_quantity
            this.product_type = product_type
            this.product_attributes = product_attributes
    }
    async createProduct( product_id ){
        const newProduct = await product.create({...this, _id: product_id})
        if(newProduct){
            await insertInventory({productId: product_id, shopId: this.product_shop, stock: this.product_quantity})
        }
        return newProduct
    }

    async updateProduct( product_id, body ){
        return await updateProductById({productId: product_id, body, model: product})
    }
}
//define subclass for different product types
class Clothing extends Product{
    async createProduct(){
        const newClothing = await clothing.create({...this.product_attributes, product_shop: this.product_shop})
        if(!newClothing) throw new BadRequestError("Create new Clothing error!")

        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestError("Create new Product error!")
        return newProduct
    }

    async updateProduct(product_id){
        const objectParams = this
        console.log('0:::::', objectParams)
        if(objectParams.product_attributes){
            await updateProductById({ productId: product_id,body: updateNestedObjectParser(objectParams.product_attributes) , model: clothing})
        }
        const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams))
        console.log('1:::::', updateNestedObjectParser(objectParams.product_attributes))
        console.log('2:::::', updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

class Electronics extends Product{
    async createProduct(){
        const newElectronic = await electronic.create({ ...this.product_attributes, product_shop: this.product_shop })
        if(!newElectronic) throw new BadRequestError("Create new Electronic error!")
        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError("Create new Product error!")
        return newProduct
    }
}

class Furniture extends Product{
    async createProduct(){
        const newFurniture = await furniture.create({ ...this.product_attributes, product_shop: this.product_shop })
        if(!newFurniture) throw new BadRequestError("Create new Furniture error!")

        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestError("Create new Product error!")
        return newProduct
    }
}

// register product types
ProductFactory.registerProductType("Electronics", Electronics)
ProductFactory.registerProductType("Furniture", Furniture)
ProductFactory.registerProductType("Clothing", Clothing)
