import express from 'express'
import router from './access/index.js'
import productRouter from './product/index.js'
import { apiKey, permission } from '../utils/checkAuth.js'
import discountRouter from './discount/index.js'
import cartRouter from './cart/index.js'
import checkoutRouter from './checkout/index.js'
import inventoryRouter from './inventory/index.js'
import commentRouter from './comment/index.js'

const route = express.Router()
//check apikey
route.use(apiKey)
//check permissions
route.use(permission('0000'))


route.use('/v1/api/inventory', inventoryRouter)
route.use('/v1/api/comment', commentRouter)
route.use('/v1/api/discount', discountRouter)
route.use('/v1/api/checkout', checkoutRouter)
route.use('/v1/api/cart', cartRouter)
route.use('/v1/api/product', productRouter)
route.use('/v1/api', router)

export default route