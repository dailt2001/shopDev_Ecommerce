import { SuccessResponse } from "../core/success.response.js"
import RBACService from "../services/rbac.service.js"


export const createResource = async(req, res, next) => {
    new SuccessResponse({
        message: 'Created resource successfully!',
        metadata: await RBACService.createResource( req.body )
    }).send(res)
}

export const resourceList = async(req, res, next) => {
    new SuccessResponse({
        message: 'Get resources successfully!',
        metadata: await RBACService.resourceList( req.query )
    }).send(res)
}

export const createRole = async(req, res, next) => {
    new SuccessResponse({
        message: 'Created role successfully!',
        metadata: await RBACService.createRole( req.body )
    }).send(res)
}

export const roleList = async(req, res, next) => {
    new SuccessResponse({
        message: 'Get roles successfully!',
        metadata: await RBACService.roleList( req.query )
    }).send(res)
}