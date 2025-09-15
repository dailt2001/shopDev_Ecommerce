import redis from 'redis'

let client = {}, connectionTimeout
const statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    ERROR: 'error',
    RECONNECT: 'reconnecting'
}
const REDIS_CONNECT_TIMEOUT = 10000
// REDIS_CONNECT_MESSAGE = {
//     code: -99,
//     message: {
//         vn: "Co loi roi!!!",
//         en: "Redis service error!"
//     }
// }

const handleTimeout = () => {
    connectionTimeout = setTimeout(() => {
        console.error("[Redis] Connection timeout > 10s")
    }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnection = ({ connectionRedis }) => {
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log('connectionRedis - statusConnection:  connected')
        clearTimeout(connectionTimeout)
    })
    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log('connectionRedis - statusConnection:  connecting')
        clearTimeout(connectionTimeout)
    })
    connectionRedis.on(statusConnectRedis.END, () => {
        console.log('connectionRedis - statusConnection:  disconnected')
        //retry 
        handleTimeout()
    })
    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log('connectionRedis - statusConnection:  Error::', err)
        //retry
        handleTimeout()
    })
}


export const initRedis = async() => {
    const instanceRedis = redis.createClient({ url: "redis://localhost:6379" })
    client.instanceConnection = instanceRedis
    handleEventConnection({ connectionRedis: instanceRedis})
    await instanceRedis.connect()
}

export const getRedis = () => client

export const closeRedis = async() => {
    if(client.instanceConnection){
        await client.instanceConnection.quit()
        console.log('Redis connection closed!')
        client.instanceConnection = null
    }
}