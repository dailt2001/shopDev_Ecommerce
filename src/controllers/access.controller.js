import { AuthFailureError } from "../core/error.response.js";
import { CREATED, SuccessResponse } from "../core/success.response.js";
import AccessService from "../services/access.service.js";

class AccessController {
    login = async (req, res, next) => {
        if(!req.body.email) throw new AuthFailureError('Email missing!')
        const sendData = Object.assign({ requestId: req.requestId }, req.body)
        new SuccessResponse({
            message: "Login Successfully!", 
            metadata: await AccessService.login(sendData)
        }).send(res)
    };
    signup = async (req, res, next) => {
        new CREATED({
            message: "Registered Successfully!", 
            metadata: await AccessService.signup(req.body)
        }).send(res)
    };
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: "Logout Successfully!", 
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    };
    handleRefreshToken = async(req, res, next) => {
        new SuccessResponse({
            message: "Get tokens Successfully!", 
            metadata: await AccessService.handleRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }
}

export default new AccessController();
