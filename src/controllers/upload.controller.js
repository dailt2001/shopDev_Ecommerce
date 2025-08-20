import { BadRequestError } from "../core/error.response.js"
import { SuccessResponse } from "../core/success.response.js"
import { uploadImageFromLocal, uploadImageFromLocalS3, uploadImageFromLocalFiles, uploadImageFromURL } from "../services/upload.service.js"


class UploadController{
    uploadFile = async(req, res, next) => {
        new SuccessResponse({
            message: "Upload Successfully!",
            metadata: await uploadImageFromURL()
        }).send(res)
    }

    uploadFileThumb = async(req, res, next) => {
        const file = req.file
        if(file){
            throw new BadRequestError("File missing!!")
        }
        new SuccessResponse({
            message: "Upload Successfully!",
            metadata: await uploadImageFromLocal({
                path: file.path
            })
        }).send(res)
    }

    uploadFromLocalFiles = async(req, res, next) => {
        const files = req.files
        if(!files.length){
            throw new BadRequestError("File missing!!")
        }
        new SuccessResponse({
            message: "Upload Successfully!",
            metadata: await uploadImageFromLocalFiles({
                files
            })
        }).send(res)
    }

    uploadFileLocalS3 = async(req, res, next) => {
        const file = req.file
        if(!file) throw new BadRequestError("file missing upload!!")
        new SuccessResponse({
            message: "Upload to S3 Successfully!",
            metadata: await uploadImageFromLocalS3({ file })
        }).send(res)
    }
}

export default new UploadController()