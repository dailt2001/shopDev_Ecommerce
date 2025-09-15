import { SuccessResponse } from "../core/success.response.js"
import { newTemplate } from "../services/template.service.js"


class EmailController{
    newTemplate = async(req, res, next) => {
        new SuccessResponse({
            message: "Created new template!",
            metadata: await newTemplate( req.body )
        }).send(res)
    }
}

export default new EmailController()