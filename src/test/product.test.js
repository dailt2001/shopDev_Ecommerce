import redisPubSubService from "../services/redisPubSub.service.js";

class ProductServiceTest {
    async purchaseProduct(productId, quantity){
        const order = { productId, quantity}
        await redisPubSubService.publish("purchase_events", JSON.stringify(order))
    }
}

export default new ProductServiceTest()