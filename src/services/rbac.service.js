import { BadRequestError } from "../core/error.response.js"
import Resource from "../models/resource.model.js"
import Role from '../models/role.model.js'

class RBACService{
    /**
     * 
     * @param {string} name // 'profile',..
     * @param {string} slug // '0001',..
     * @param {string} description 
     */
    static async createResource({name = 'profile', slug = '0001', description }){
    if(!name) throw new BadRequestError("Please fill resource name!!")
    const resource = await Resource.create({
        resource_name: name,
        resource_slug: slug,
        resource_description: description,
    })

    return resource
    }

    static async resourceList({
        userId = 0,
        limit = 30, 
        offset = 10, 
        search = ''
    }){
        // check admin ? middleware function
        return await Resource.aggregate([
            {
                $project: {
                    _id: 0,
                    name: '$resource_name',
                    slug: '$resource_slug',
                    description: '$resource_description',
                    resourceId: '$_id',
                    createdAt: 1
                }
            }
        ])
    }

    static async createRole({ name, slug, description, grants = [] }){
        return await Role.create({
            role_name: name,
            role_slug: slug,
            role_description: description,
            role_grants: grants 
        })
    }

    static async roleList(){
        const roles = await Role.aggregate([
            {
                $unwind: "$role_grants"
            },
            {
                $lookup: {
                    from: 'Resources',
                    localField:'role_grants.resource',
                    foreignField: "_id",
                    as: 'resource'
                }
            },
            {
                $unwind: "$resource"
            },
            {
                $project: {
                    role: "$role_name",
                    resource: "$resource.resource_name",
                    attributes: "$role_grants.attributes",
                    action: "$role_grants.actions",
                    _id: 0
                }
            },
            {
                $unwind: "$action"
            }
        ])
        return roles
    }
}

export default RBACService