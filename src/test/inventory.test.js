import redisPubSubService from "../services/redisPubSub.service.js";

class InventoryServiceTest{
    constructor(){
        redisPubSubService.subscribe("purchase_events", (channel, message) => {
            console.log("Received message", message)
            const parsedMessage = JSON.parse(message)
            console.log("message:::", parsedMessage)
            InventoryServiceTest.updateInventory(parsedMessage)
        })
    }

    static updateInventory({productId, quantity}){
        console.log(`Updated Inventory ${productId} with quantity ${quantity}!`)
    }
}

export default new InventoryServiceTest()