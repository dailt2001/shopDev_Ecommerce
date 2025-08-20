import multer from 'multer'

export const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './src/uploads/')
        },
        filename: function(req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    })
})

export const uploadMemory = multer({
    storage: multer.memoryStorage()
})