import { getCacheIO } from "../models/repository/cache.repo.js";
import { generateCacheKey } from "../utils/index.js";
export const readCache = async (req, res, next) => {
    const { sku_id, product_id } = req.query
    // check param
    if (sku_id < 0) return null;
    if (product_id < 0) return null;
    //get cache
    let skuCache;
    const skuKeyCache = generateCacheKey(sku_id);

    skuCache = await getCacheIO({key:skuKeyCache});
    if(!skuCache) return next()
    if(skuCache){
        return res.status(200).json({
            ...skuCache,
            toLoad: 'redis cache'
        })
    }
};
