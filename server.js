import app from "./src/app.js"

const PORT = process.env.DEV_APP_PORT || 3052

const server = app.listen(PORT, () => {
    console.log(`eCommerce start with ${PORT}`)
})

process.on("SIGINT", () => {
    server.close(() => console.log('Exit Server Express'))
})