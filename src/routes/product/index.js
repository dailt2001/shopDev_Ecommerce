import express from 'express'
import ProductController from '../../controllers/product.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { authentication } from '../../utils/Auth.js'

const router = express.Router()

router.get('/search/:keySearch', asyncHandler(ProductController.getListSearchProduct))
router.get('', asyncHandler(ProductController.findAllProducts))
router.get('/:product_id', asyncHandler(ProductController.findProduct))
//authentication
router.use(authentication)
router.post('', asyncHandler(ProductController.createProduct))
router.patch('/update/:productId', asyncHandler(ProductController.updateProduct))
router.post('/publish/:id', asyncHandler(ProductController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(ProductController.unPublishProductByShop))
//query
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(ProductController.getAllPublishForShop))



export default router