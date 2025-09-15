import { SuccessResponse } from "../core/success.response.js"
import { newUser, verifyLinkEmailWithLogin } from "../services/user.service.js"


class UserController{
    newUser = async (req, res, next) => {
        const response = await newUser({ email: req.body.email })
        new SuccessResponse(response).send(res)
    }

    checkLoginEmailToken = async(req, res, next) => {
        const token = req.query.token
        new SuccessResponse({
            message: "Created user successfully!",
            metadata: await verifyLinkEmailWithLogin(token)
        }).send(res)
    }
}

export default new UserController()