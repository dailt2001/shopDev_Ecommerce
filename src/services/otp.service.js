import  crypto from 'crypto'
import Otp from '../models/otp.model.js'
import { NotFound } from '../core/error.response.js'

const generateTokenRandom = () => {
    const token = crypto.randomInt(0, Math.pow(2,32))
    return token
}

export const newOtp = async({ email }) => {
    const token = generateTokenRandom()
    const newOtpToken = await Otp.create({
        otp_token: token,
        otp_email: email
    })

    return newOtpToken
}

export const checkOtpToken = async(token) => {
    const existedToken = await Otp.findOne({ otp_token: token }).lean()
    if(!existedToken) throw new NotFound("Otp does not exist!!")
    await Otp.deleteOne({ otp_token: token })
    return existedToken
}