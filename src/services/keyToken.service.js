import { convertToObjectIdMongodb } from "../utils/index.js";
import keyTokenModel from "../models/keytoken.model.js";


class keyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken = null }) => {
        try {
            // level -

            // const token = await keyTokenModel.create({
            //     publicKey,
            //     privateKey,
            //     user: userId,
            // });
            // return token ? token.publicKey : null;

            //level  +
            const filter = {user: userId}
            const update = { privateKey, publicKey, refreshTokensUsed: [], refreshToken }
            const options = { upsert: true, new: true }
            const tokens = await keyTokenModel.findOneAndUpdate(filter, { $set: update}, options)
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error;
        }
    };
    static findUserById = async ( userId ) => {
        return await keyTokenModel.findOne({ user: convertToObjectIdMongodb(userId) })
    }
    static removeKeyById = async(id) => {
        return await keyTokenModel.deleteOne(id)
    }
    static findRefreshTokenUsed = async( refreshToken ) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken })
    }
    static findRefreshToken = async( refreshToken ) => {
        return await keyTokenModel.findOne({ refreshToken })
    }
    static deleteKeyById = async( userId ) => {
        return await keyTokenModel.deleteOne({ user: userId })
    }
}

export default keyTokenService;
