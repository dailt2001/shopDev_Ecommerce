// import mysql from 'mysql2';
// import express from 'express'
// //const app = express()

// export const pool = mysql.createPool({
//     host: 'localhost',
//     port: 8811,
//     user: 'root',
//     password: 'tipjs',
//     database: 'test',
//     connectionLimit:10
// })

// const batchSize = 100000 
// const totalSize = 10_000_000
// let currentId = 1

// console.time('::::::TIMER:::::')

// const insertBatch = async () => {
//     let values = []
//     for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
//         const name = `name-${currentId}`
//         const age = currentId
//         const address = `address-${currentId}`
//         values.push([currentId, name ,age ,address])
//         currentId++
//     }
//     if(!values.length){
//         console.timeEnd('::::::TIMER:::::')
//         pool.end(err => {
//             if(err) console.log('Error occurred while running! ')
//             console.log('Connection pool closed successfully!')
//         })
//         return ;
//     }

//     const sql = `INSERT INTO test_table(id,name,age,address) VALUES ?`
//     pool.query(sql, [values], async (err, results) => {
//         if(err) throw err
//         console.log(`Inserted ${results.affectedRows} records`)
//         await insertBatch()
//     })
// }

// insertBatch().catch(console.error)

// // console.log("📡 Testing MySQL connection...");
// // pool.query('SELECT 1', (err, results) => {
// //     if (err) {
// //         console.error("❌ Connection error:", err);
// //     } else {
// //         console.log("✅ Connected! Result:", results);
// //     }
// //     process.exit();
// // });

