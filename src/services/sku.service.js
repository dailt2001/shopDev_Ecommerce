import { generateCacheKey, randomId } from "../utils/index.js";
import Sku from "../models/sku.model.js";
import _ from "lodash";
import { setCacheIOExpiration } from "../models/repository/cache.repo.js";

export const newSku = async ({ sku_list, product_id }) => {
    try {
        const convert_sku_list = sku_list.map((sku) => {
            return { ...sku, product_id, sku_id: `${product_id}.${randomId()}` };
        });
        const skus = await Sku.create(convert_sku_list);
        return skus;
    } catch (error) {
        throw error;
    }
};

export const getSku = async ({ sku_id, product_id }) => {
    const skuKeyCache = generateCacheKey(sku_id);
    const skuCache = await Sku.findOne({ sku_id, product_id }).lean();
    if (!skuCache) throw new NotFound("Not Found product(sku)!");
    await setCacheIOExpiration({key: skuKeyCache, value: skuCache, expirationBySeconds: 120 });

    return {
        ...skuCache,
        toLoad: "dbs",
    };
    // const sku = await Sku.findOne({ sku_id, product_id }).lean()
    // if(!sku) throw new NotFound("Not Found product(sku)!")

    // return _.omit(sku, ['_v', 'updatedAt', 'createdAt', 'isDeleted'])
};

export const getAllSku = async ({ product_id }) => {
    const allSku = await Sku.find({ product_id }).lean();
    if (!allSku) throw new NotFound("Not Found product(sku)!");
    //set cache

    //
    const skus = allSku.map((sku) => _.omit(sku, ["_v", "updatedAt", "createdAt", "isDeleted"]));
    return skus;
};

export const replaceAllSkus = async({ sku_list, product_id }) => {
    await Sku.deleteMany({ product_id })
    const convert_sku_list = sku_list.map((sku) => {
        return { ...sku, product_id, sku_id: `${product_id}.${randomId()}`}
    })
    const newskus = await Sku.insertMany(convert_sku_list)
    return newskus
}


