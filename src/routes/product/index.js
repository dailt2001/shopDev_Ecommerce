import express from 'express'
import ProductController from '../../controllers/product.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { authentication } from '../../utils/Auth.js'
import { readCache } from '../../middlewares/cache.middleware.js'

const router = express.Router()

router.get('/sku/select_variation', readCache,  asyncHandler(ProductController.findOneSku))
router.get('/sku/all', asyncHandler(ProductController.findSkusBySpu))
router.get('/spu/get_spu_info', asyncHandler(ProductController.findOneSpu))
router.get('/spu/search', asyncHandler(ProductController.searchSpu))


router.get('/search/:keySearch', asyncHandler(ProductController.getListSearchProduct))
router.get('', asyncHandler(ProductController.findAllProducts))
router.get('/:product_id', asyncHandler(ProductController.findProduct))

//authentication

router.use(authentication)
router.post('/spu/new', asyncHandler(ProductController.createSpu))
router.patch('/spu/:product_id', asyncHandler(ProductController.updateSpuWithSkus))


router.post('', asyncHandler(ProductController.createProduct))
router.patch('/update/:productId', asyncHandler(ProductController.updateProduct))
router.post('/publish/:id', asyncHandler(ProductController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(ProductController.unPublishProductByShop))
//query
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(ProductController.getAllPublishForShop))



export default router