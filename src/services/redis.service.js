import { reservationInventory } from "../models/repository/inventory.repo.js";
import { getRedis } from "../dbs/init.redis.js";

// const redisClient = redis.createClient({ url: "redis://localhost:6379" });
// redisClient.on("Error::", (error) => console.log(error));

// await redisClient.connect();
// console.log("Connected to redis!");

const { instanceConnection: redisClient } = getRedis()


export const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2025_${productId}`; // ma lock
    const retryTimes = 10; // so lan cho
    const expireTime = 3000; // thoi gian lock

    for (let i = 0; i < retryTimes; i++) {
        //tao 1 key ai nam giu dc vao thanh toan
        const result = await redisClient.set(key, cartId, { NX: true, PX: expireTime });
        console.log("result:::", result);
        if (result === "OK") {
            // tao key thanh cong
            //inventory?
            const isReservation = await reservationInventory({ productId, quantity, cartId });
            if (isReservation.modifiedCount) {
                return key;
            } else {
                // dat hang that bai
                const value = await redisClient.get(key);
                if (value === cartId) await redisClient.del(key);
                return null;
            }
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
    return null;
};

export const releaseLock = async (keyLock, cartId) => {
    const value = await redisClient.get(keyLock);
    if (value === cartId) {
        await redisClient.del(keyLock);
        console.log("Lock released!");
    } else {
        console.log("Lock is already released or owned by another process.");
    }
};
