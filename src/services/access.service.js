import shopModel from "../models/shop.model.js";
import bcrypt from "bcrypt";
import keyTokenService from "./keyToken.service.js";
import { createTokenPair, verifyJWT } from "../utils/Auth.js";
import { generateKeys, getInfoData } from "../utils/index.js";
import {
    AuthFailureError,
    BadRequestError,
    ForbiddenError,
} from "../core/error.response.js";
import { rolesShop } from "../constant/access.constant.js";
import { findByEmail } from "./shop.service.js";

class AccessService {
    static handleRefreshToken = async ({ refreshToken, user, keyStore }) => {
        // check token used
        const { userId, email } = user
        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await keyTokenService.deleteKeyById(userId);
            throw new ForbiddenError("Something wrong!! Please Relogin!");
        }
        if(keyStore.refreshToken !== refreshToken) throw new AuthFailureError("Shop not registered!");

         //create new tokens when AT expired 
        const tokens = await createTokenPair(
            { userId, email },
            keyStore.privateKey,
            keyStore.publicKey
        );
        //update token
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })
        return {
            user,
            tokens
        }
    };

    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new BadRequestError("Shop not registered!");

        const matchPassword = await bcrypt.compare(
            password,
            foundShop.password
        );
        if (!matchPassword)
            throw new AuthFailureError("Password does not match!");

        const { privateKey, publicKey } = generateKeys();
        const tokens = await createTokenPair(
            { userId: foundShop._id, email },
            privateKey,
            publicKey
        );

        await keyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        return {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: foundShop,
            }),
            tokens,
        };
    };

    static signup = async ({ name, email, password }) => {
        // try {
        // check email exist
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestError("Error: Shop already registered!");
        }
        const passwordHashed = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHashed,
            roles: [rolesShop.SHOP],
        });
        if (newShop) {
            // const { privateKey, publicKey } = crypto.generateKeyPairSync(
            //     "rsa",
            //     {
            //         modulusLength: 4096,
            //         publicKeyEncoding: {
            //             type: 'pkcs1',
            //             format: 'pem'
            //         },
            //         privateKeyEncoding: {
            //             type: 'pkcs1',
            //             format: 'pem'
            //         }
            //     }
            // );
            const { privateKey, publicKey } = generateKeys();
            //create token
            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                privateKey,
                publicKey
            );
            console.log("Created Token Success!");
            const keyStore = await keyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken
            });
            if (!keyStore) {
                return {
                    code: "xxxx",
                    message: "PublicKey and PrivateKey does not exist!",
                };
            }
            return {
                shop: getInfoData({
                    fields: ["_id", "name", "email"],
                    object: newShop,
                }),
                tokens,
            };
        }
        return {
            code: 200,
            metadata: null,
        };
        // } catch (error) {
        //     return {
        //         code: "xxxx",
        //         message: error.message,
        //         status: "error",
        //     }
        // }
    };

    static logout = async (keyStore) => {
        const delKey = await keyTokenService.removeKeyById(keyStore._id);
        return delKey;
    };
}

export default AccessService;
