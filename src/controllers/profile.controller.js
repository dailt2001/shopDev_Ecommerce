import { SuccessResponse } from "../core/success.response.js"

const dataProfiles = [
    {
        name: 'cr7',
        id: 1
    },
    {
        name: 'm10',
        id: 2
    },{
        name: 'mp3',
        id: 3
    }
]

class ProfileController{
    profile = (req, res, next) => {
        new SuccessResponse({
            message: 'Get profile Successfully!!',
            metadata: dataProfiles[1]
        }).send(res)
    }

    profiles = (req, res, next) => {
        new SuccessResponse({
            message: 'Get profiles Successfully!!',
            metadata: dataProfiles
        }).send(res)
    }
}

export default new ProfileController()