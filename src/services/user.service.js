import { BadRequestError, ConflictRequestError } from '../core/error.response.js'
import User from '../models/user.model.js'
import { sendEmailToken } from './email.service.js'
import { checkOtpToken } from './otp.service.js'
import  bcrypt  from 'bcrypt'
import keyTokenService from './keyToken.service.js'
import { createTokenPair } from '../utils/Auth.js'
import { generateKeys, getInfoData } from '../utils/index.js'

const findUserByEmailWithLogin = async(email) => {
    return await User.findOne({ user_email: email}).lean()
}

export const newUser = async({ email = null, captcha = null }) => {
    const user = await User.findOne({ user_email: email }).lean()
    if(user) {
        throw new ConflictRequestError("Email already existed!")
    }
    //send email to user   
    const result = await sendEmailToken({ email })

    return {
        message: "verify email user",
        metadata: { result }
    }
}

export const verifyLinkEmailWithLogin = async( token ) => {
    const { otp_email: email } = await checkOtpToken( token )

    const user = await findUserByEmailWithLogin(email)
    if(user) throw new ConflictRequestError("Email already existed!")
    //new user
    const hashPassword = await bcrypt.hash(email, 10)
    const newUser = await User.create({
        user_id: 1,
        user_email: email,
        user_name: email,
        user_slug: 'xxx-user',
        user_password: hashPassword,
    })
    if(newUser){

    const { privateKey, publicKey } = generateKeys()
    const keyStore = await keyTokenService.createKeyToken({
        userId: newUser.user_id,
        publicKey,
        privateKey
    })
    if(!keyStore) throw new BadRequestError("Create keyStore user error!!")

    const tokens = await createTokenPair({ userId: newUser.user_id, email}, privateKey, publicKey)
    return {
            user: getInfoData({fields: ['user_id', 'user_name', 'user_email'], object: newUser}),
            tokens
    }
    }
    return {
            code: 200,
            metadata: null,
    };
}