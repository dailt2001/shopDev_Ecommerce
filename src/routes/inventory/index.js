import inventoryController from "../../controllers/inventory.controller.js"
import express from "express"
import { asyncHandler } from "../../helpers/asyncHandler.js"
import { authentication } from "../../utils/Auth.js"

const inventoryRouter = express.Router()

inventoryRouter.use(authentication)
inventoryRouter.post("", asyncHandler(inventoryController.addStockToInventory))

export default inventoryRouter