import { convertToObjectIdMongodb } from "../../utils/index.js"
import  inventory  from "../inventory.model.js"
import { Types } from "mongoose"

export const insertInventory = async({ productId, shopId, stock, location = 'unKnow'}) => {
    return await inventory.create({
        inven_productId: productId,
        inven_location: location,
        inven_shopId: shopId,
        inven_stock: stock
    })
}

export const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = { inven_productId: convertToObjectIdMongodb(productId), inven_stock:{ $gte: quantity } }
    const updateSet = {
        $inc: {
            inven_stock: -quantity
        }, $push: {
            inven_reservations:{
                quantity, cartId, createOn: new Date()
            }
        }
    }
    const options = { new: true, upsert: true }
    return await inventory.updateOne(query, updateSet, options)
}

export const addStock = async ({ productId, location, shopId, stock }) => {
    const query = { inven_productId: productId, inven_shopId: shopId },
    updateSet = {
        $inc: { inven_stock: stock },
        $set: { inven_location: location} 
    }, options = {
        upsert: true, new: true
    }
    return await inventory.findOneAndUpdate(query, updateSet, options )
}