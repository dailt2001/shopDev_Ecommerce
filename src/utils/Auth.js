import { AuthFailureError, NotFound } from "../core/error.response.js";
import { HEADER } from "../constant/access.constant.js";
import { asyncHandler } from "../helpers/asyncHandler.js";
import JWT from "jsonwebtoken";
import keyTokenService from "../services/keyToken.service.js";

export const createTokenPair = async (payload, privateKey, publicKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: "2 days",
        });
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: "7 days",
        });
        JWT.verify(accessToken, publicKey, (error, decode) => {
            if (error) {
                console.log("error verify token::", error);
            } else {
                console.log("decode verify::", decode);
            }
        });
        return { accessToken, refreshToken };
    } catch (error) {
        console.log("ErrorCreateToken::", error);
    }
};

export const authentication = asyncHandler(async (req, res, next) => {
    console.log('Auth is running!')
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("Invalid Request!");
    const keyStore = await keyTokenService.findUserById(userId);
    if (!keyStore) throw new NotFound("Not Found User!!");

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    const refreshToken = req.headers[HEADER.REFRESHTOKEN];

    let decodedUser = null;
    try {
        if (refreshToken) {
            decodedUser = JWT.verify(refreshToken, keyStore.privateKey);
            if (userId !== decodedUser.userId) throw new AuthFailureError("Invalid User!");
        } else if(accessToken){
            decodedUser = JWT.verify(accessToken, keyStore.publicKey);
            if (userId !== decodedUser.userId) throw new AuthFailureError("Invalid User!");
        } else {
            throw new AuthFailureError("No Token provided!!")
        }
        req.keyStore = keyStore;
        req.user = decodedUser;
        req.refreshToken = refreshToken;
        return next();
    } catch (error) {
        throw error;
    }

    // if (!accessToken) throw new AuthFailureError("Invalid Request!");

    // try {
    //     const decodedUser = JWT.verify(accessToken, keyStore.publicKey);
    //     if (userId !== decodedUser.userId) throw new AuthFailureError("Invalid User!");
    //     req.keyStore = keyStore;
    //     return next();
    // } catch (error) {
    //     throw error;
    // }
});

export const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
};
