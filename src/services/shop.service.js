import  shopModel  from '../models/shop.model.js'

class shopService{}

export const findByEmail = async({ email , select = { email: 1 , name: 1, password: 2, roles: 1, status: 1}}) => {
    return await shopModel.findOne({ email }).select(select).lean()
}
        