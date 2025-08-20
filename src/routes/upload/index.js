import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { authentication } from '../../utils/Auth.js'
import UploadController from '../../controllers/upload.controller.js'
import { uploadDisk, uploadMemory } from '../../configs/multer.config.js'

const uploadRouter = express.Router()

uploadRouter.post('/product', asyncHandler(UploadController.uploadFile))
uploadRouter.post('/product/thumb', uploadDisk.single('file') ,asyncHandler(UploadController.uploadFileThumb))
uploadRouter.post('/product/multiple', uploadDisk.array('files', 3) ,asyncHandler(UploadController.uploadFromLocalFiles))

uploadRouter.post('/product/bucket', uploadMemory.single('file') ,asyncHandler(UploadController.uploadFileLocalS3))


export default uploadRouter