import { Redis } from "ioredis";

let client = {},
    connectionTimeout;
const statusConnectRedis = {
    CONNECT: "connect",
    END: "end",
    ERROR: "error",
    RECONNECT: "reconnecting",
};
const REDIS_CONNECT_TIMEOUT = 10000;
// REDIS_CONNECT_MESSAGE = {
//     code: -99,
//     message: {
//         vn: "Co loi roi!!!",
//         en: "Redis service error!"
//     }
// }

const handleTimeout = () => {
    connectionTimeout = setTimeout(() => {
        console.error("[Redis] Connection timeout > 10s");
    }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnection = ({ connectionRedis }) => {
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log("connectionIORedis - statusConnection:  connected");
        clearTimeout(connectionTimeout);
    });
    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log("connectionIORedis - statusConnection:  connecting");
        clearTimeout(connectionTimeout);
    });
    connectionRedis.on(statusConnectRedis.END, () => {
        console.log("connectionIORedis - statusConnection:  disconnected");
        //retry
        handleTimeout();
    });
    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log("connectionIORedis - statusConnection:  Error::", err);
        //retry
        handleTimeout();
    });
};

export const initIORedis = ({ IOREDIS_IS_ENABLED }) => {
    let instanceRedis;
    if (IOREDIS_IS_ENABLED) {
        instanceRedis = new Redis("redis://localhost:6379");
        client.instanceConnection = instanceRedis;
        handleEventConnection({ connectionRedis: instanceRedis });
    }
    return instanceRedis;
};

export const getIORedis = () => client;

export const closeIORedis = async () => {
    if (client.instanceConnection) {
        await client.instanceConnection.quit();
        console.log("Redis connection closed!");
        client.instanceConnection = null;
    }
};
