import express from 'express'
import profileController from '../../controllers/profile.controller.js'
import { grantAccess } from '../../middlewares/rbac.js'

const profileRouter = express.Router()

profileRouter.get('/viewAny', grantAccess('read:any','profile'), profileController.profiles)
profileRouter.get('/viewOne', grantAccess('read:own', 'profile'),profileController.profile)


export default profileRouter