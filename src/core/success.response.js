import { StatusCodes } from "../constant/statusCodes.js";
import { ReasonStatusCode } from "../constant/reasonPhrases.js";

export class SuccessResponse {
    constructor({ message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }){
        this.message = message ? message : reasonStatusCode
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, header = {}){
        return res.status(this.status).json(this)
    }
}

export class OK extends SuccessResponse{
    constructor({ message, metadata}){
        super({ message, metadata })
    }
}

export class CREATED extends SuccessResponse{
    constructor({ message, statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata, options}){
        super({ message, statusCode, reasonStatusCode, metadata })
        this.options = options
    }
}