import InventoryService from "../services/inventory.service.js"
import { SuccessResponse } from "../core/success.response.js"


class InventoryController{
    addStockToInventory = async(req, res, next) => {
        new SuccessResponse({
            message: "Add stock to inventory successfully!!",
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)
    }
}

export default new InventoryController()