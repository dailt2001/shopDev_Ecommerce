import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { createResource, createRole, resourceList, roleList } from '../../controllers/rbac.controller.js'

const rbacRouter = express.Router()

rbacRouter.post('/resource', asyncHandler(createResource))
rbacRouter.get('/resource', asyncHandler(resourceList))

rbacRouter.post('/role', asyncHandler(createRole))
rbacRouter.get('/role', asyncHandler(roleList))

export default rbacRouter