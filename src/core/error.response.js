import { ReasonStatusCode } from '../constant/reasonPhrases.js'
import { StatusCodes } from '../constant/statusCodes.js'

class ErrorResponse extends Error{
    constructor(message, status){
        super(message)
        this.status = status
    }
}

export class ConflictRequestError extends ErrorResponse{
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCodes.CONFLICT){
        super(message, statusCode)
    }
}
export class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.BAD_REQUEST, statusCode = StatusCodes.BAD_REQUEST){
        super(message, statusCode)
    }
}

export class AuthFailureError extends ErrorResponse{
    constructor(message = ReasonStatusCode.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED){
        super(message, status)
    }
}

export class NotFound extends ErrorResponse{
    constructor(message = ReasonStatusCode.NOT_FOUND, status = StatusCodes.NOT_FOUND){
        super(message, status)
    }
}
export class ForbiddenError extends ErrorResponse{
    constructor(message = ReasonStatusCode.FORBIDDEN, status = StatusCodes.FORBIDDEN){
        super(message, status)
    }
}


