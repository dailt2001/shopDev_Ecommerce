import apikeyModel from '../models/apikey.model.js'
import crypto from 'crypto'
import { HEADER } from '../constant/access.constant.js';


export const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY];
        if(!key) {
            return res.status(403).json({
                message: "Forbidden Error",
            });
        }

        // const newKey = await apikeyModel.create({ key: crypto.randomBytes(64).toString('hex'), permissions: ['0000']})
        // console.log(newKey)
        const objKey = await apikeyModel.findOne({ key: key.toString(), status: true }).lean();
        if(!objKey){
            return res.status(403).json({
                message: "Forbidden Error",
            });
        }
        req.objKey = objKey
        return next()
    } catch (error) {
        console.error("API key not invalid::", error.message)
    }
};

export const permission = ( permission ) => {
    return (req, res, next) => {
        console.log("req.objectKey::::", req.objKey)
        if(!req.objKey.permissions){
            return res.status(403).json({
                message: "Permission denied",
            });
        }
        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission){
            return res.status(403).json({
                message: "Permission denied",
            });
        }
        return next()
    }
}


