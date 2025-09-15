import { getIORedis } from "../../dbs/init.ioredis.js"


export const setCacheIO = async({ key, value}) => {
    try {
        const redisCache = getIORedis().instanceConnection
        if(!redisCache) throw new Error("Redis client not initialized!")
        return await redisCache.set(key, JSON.stringify(value))
    } catch (error) {
        throw new Error(`Redis cache error: ${error.message}`)
    }
}

export const setCacheIOExpiration = async({ key, value, expirationBySeconds }) => {
    try {
        const redisCache = getIORedis().instanceConnection
        if(!redisCache) throw new Error("Redis client not initialized!")
        return await redisCache.set(key,JSON.stringify(value),'EX', expirationBySeconds)
    } catch (error) {
        throw new Error(`Redis cache error: ${error.message}`)
    }
}

export const getCacheIO = async({ key }) => {
    try {
        const redisCache = getIORedis().instanceConnection
        if(!redisCache) throw new Error("Redis client not initialized!")
        const value =  await redisCache.get(key)
        return JSON.parse(value)
    } catch (error) {
        throw new Error(`Redis cache error: ${error.message}`)
    }
}