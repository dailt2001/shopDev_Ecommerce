import { convertToObjectIdMongodb } from '../../utils/index.js'
import Shop from '../shop.model.js'

const selectStruct = {
    name: 1, email: 1, status: 1, roles: 1
}

export const findShopById = async({ shop_id, select = selectStruct}) => {
    return await Shop.findById({ _id: convertToObjectIdMongodb(shop_id) }).select(select)
}