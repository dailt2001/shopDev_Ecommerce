import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet'
import compression from 'compression';
import dotenv from 'dotenv'
import route from './routes/index.js';
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

//test pubsub
// import productTest from './test/product.test.js';
// import inventoryTest from './test/inventory.test.js';

// await productTest.purchaseProduct("product:001", 11)
//init db
import './dbs/init.mongodb.js';
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
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || "Internal Server Error!"
    })
})


export default app; 