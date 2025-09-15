import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet'
import compression from 'compression';
import dotenv from 'dotenv'
import route from './routes/index.js';
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import myLogger from './loggers/myLogger.log.js'
import { initRedis } from './dbs/init.redis.js';
import { initIORedis } from './dbs/init.ioredis.js';
import { initElasticsearch } from './dbs/init.elasticsearch.js';
//import {pool} from './test/mysql/connect.mysql.test.js'
dotenv.config()
const app = express();

//init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cors());

app.use((req, res, next) => {
    const requestId = req.headers['x-request-id']
    req.requestId  = requestId ? requestId : uuidv4()
    myLogger.log('input params', [
        req.path,
        {requestId: req.requestId},
        req.method === "POST" ? req.body : req.query
    ])
    next()
})

//test pubsub
// import productTest from './test/product.test.js';
// import inventoryTest from './test/inventory.test.js';

// await productTest.purchaseProduct("product:001", 11)
//init db
import './dbs/init.mongodb.js';
//await initRedis()
initIORedis({ IOREDIS_IS_ENABLED: true })
await initElasticsearch({ ELASTICSEARCH_IS_ENABLED: true })


//checkOverLoad()

//test db
// app.get('/users', (req, res) => {
//   pool.query('SELECT * FROM test_table', (err, results) => {
//     if (err){
//         console.log('error::', err)
//         res.send(err)
//         return;
//     } 
//     console.log('result::', results)
//     res.send(results)
//   });
// });


//init routes
app.use('/', route)
//init errors handler
app.use((req, res, next) => {
    const error = new Error('Not Found!')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode  = error.status || 500 

    const resMessage = `${error.status} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`
    
    myLogger.error(resMessage, [
        req.path,
        { requestId: req.requestId },
        { message: error.message }
    ])

    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || "Internal Server Error!"
    })
})


export default app; 