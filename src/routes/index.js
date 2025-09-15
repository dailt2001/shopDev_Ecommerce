import express from 'express'
import router from './access/index.js'
import productRouter from './product/index.js'
import { apiKey, permission } from '../utils/checkAuth.js'
import discountRouter from './discount/index.js'
import cartRouter from './cart/index.js'
import checkoutRouter from './checkout/index.js'
import inventoryRouter from './inventory/index.js'
import commentRouter from './comment/index.js'
import notificationRouter from './notification/index.js'
import uploadRouter from './upload/index.js'
import profileRouter from './profile/index.js'
import rbacRouter from './rbac/index.js'
import emailRouter from './email/index.js'
import userRouter from './user/index.js'

const route = express.Router()
//check apikey
//route.use(apiKey)
//check permissions
//route.use(permission('0000'))

route.use('/v1/api/upload', uploadRouter)
route.use('/v1/api/rbac', rbacRouter)
route.use('/v1/api/email', emailRouter)
route.use('/v1/api/user', userRouter)
route.use('/v1/api/profile', profileRouter)
route.use('/v1/api/inventory', inventoryRouter)
route.use('/v1/api/comment', commentRouter)
route.use('/v1/api/notification', notificationRouter)
route.use('/v1/api/discount', discountRouter)
route.use('/v1/api/checkout', checkoutRouter)
route.use('/v1/api/cart', cartRouter)
route.use('/v1/api/product', productRouter)
route.use('/v1/api', router)

export default route