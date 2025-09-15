import cloudinary from "../configs/config.cloudinary.js";
import s3 from "../configs/s3.config.js";
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
//import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer"; 
import crypto from 'crypto'

// upload using s3

export const uploadImageFromLocalS3 = async ({ file }) => {
    const randomImageName = () => crypto.randomBytes(16).toString('hex')
    const imageName = randomImageName()
    const urlImagePublic = 'https://djwn9otakry52.cloudfront.net'

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName,
        Body: file.buffer,
        ContentType: 'image/jpeg'
    })
    const result = await s3.send(command)
    
    // 1.S3 get signedUrl

    // const signedUrl = new GetObjectCommand({
    //     Bucket: process.env.AWS_BUCKET_NAME,
    //     Key: imageName
    // })
    // const getSignedURL = await getSignedUrl(s3, signedUrl, {expiresIn: 3600})
    // console.log('url::', getSignedURL)

    // 2.Cloudfront getSignedUrl
    
    const getSignedURL = getSignedUrl({
        url: `${urlImagePublic}/${imageName}`,
        keyPairId: 'KEEMO00PFZSVR', // keyname public
        privateKey: process.env.AWS_CLOUDFRONT_PRIVATE_KEY,
        dateLessThan: new Date(Date.now() + 1000*60)
    })

    return {
        getSignedURL,result
    }
}

//// END S3 SERVICE

// upload from URL image

export const uploadImageFromURL = async () => {
    try {
        const imageURL = "https://tse3.mm.bing.net/th/id/OIP.f3LiSE1LNJN64C2zp-JJ4gHaD-?pid=Api&P=0&h=220";
        const folderName = "product/shopID";
        const newFileName = "test_demo";
        const result = await cloudinary.uploader.upload(imageURL, {
            public_id: newFileName,
            folder: folderName,
        });
        console.log("Result::", result)
        return result
    } catch (error) {
        console.error("Error uploading image::", error);
        throw new Error('Fail', error.message);
    }
};

//upload from local file

export const uploadImageFromLocal = async({ path }) => {
    try {
        const folderName = 'product/shopID'
        const fileName = 'thumb'
        const result = await cloudinary.uploader.upload(path, {
            public_id: fileName,
            folder: folderName
        })
    return {
        url: result.secure_url,
        shopId: 'shopID',
        thumb_url: await cloudinary.url(result.public_id, {
            height: 100, 
            width: 100,
            format: 'jpg'
        })
    }
    } catch (error) {
        console.error("Upload file error::", error)
        throw error
    }
}

// upload from local files 

export const uploadImageFromLocalFiles = async({ files }) => {
    try {
        console.log('files::', files)
        const folderName = 'product/shopID'
        if(!files.length) return 

        const uploadUrls = []
        for(const file of files){
            const result = await cloudinary.uploader.upload(file.path, {
                folder: folderName
            })
            uploadUrls.push({
                image_url: result.secure_url,
                shopId: 'shop'
            })
        }
        return uploadUrls
    } catch (error) {
        console.error("Error uploading files::", error)
        throw error
    }
}


