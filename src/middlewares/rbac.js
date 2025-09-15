import { AuthFailureError } from "../core/error.response.js"
import { ac } from "./role.middleware.js"
import RBACService from "../services/rbac.service.js"
/**
 * 
 * @param {*string} action // read, update, delete
 * @param {*string} resource // profile, balance, payment ,...
 */
export const grantAccess = (action, resource) => {
    return async(req, res, next) => {
        try {
            ac.setGrants( await RBACService.roleList())
            const role_name = req.query.role
            // const permission = ac.can(role_name)[action](resource)
            const permission = ac.permission({
                role: role_name,
                action: action,
                resource: resource
            })
            if(!permission.granted){
                throw new AuthFailureError("You don't have permission access!!")
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}