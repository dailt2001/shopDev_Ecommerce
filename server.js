import app from "./src/app.js"
import { closeIORedis } from "./src/dbs/init.ioredis.js"
// import { closeRedis } from "./src/dbs/init.redis.js"

const PORT = process.env.DEV_APP_PORT || 3052

const server = app.listen(PORT, () => {
    console.log(`eCommerce start with ${PORT}`)
})

process.on("SIGINT", async() => {
    await closeIORedis()
    console.log('Redis connection closed!')
    server.close(() => {
        console.log('Exit Server Express')
        process.exit(0)
    })
})