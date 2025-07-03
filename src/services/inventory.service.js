import { getProductById } from "../models/repository/product.repo.js"
import inventory from "../models/inventory.model.js"
import { NotFound } from "../core/error.response.js"
import { addStock } from "../models/repository/inventory.repo.js"

class InventoryService {
    static async addStockToInventory({ productId, stock, shopId, location = "Ha Noi, Viet Nam"}){
        const product = await getProductById(productId)
        if(!product) throw new NotFound("Product does not exist!!")
        return await addStock({productId, location, shopId, stock })
    }
}

export default InventoryService