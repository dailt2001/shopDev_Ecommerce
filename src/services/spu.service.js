import { randomId, updateNestedObjectParser } from "../utils/index.js";
import { NotFound } from "../core/error.response.js";
import { findShopById } from "../models/repository/shop.repo.js";
import Spu from "../models/spu.model.js";
import { getAllSku, newSku, replaceAllSkus } from "./sku.service.js";
import _ from "lodash";
import { indexProductToES } from "../utils/elasticsearch.js";

export const newSpu = async ({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_category,
    product_shop,
    product_attributes,
    product_quantity,
    product_variations,
    sku_list = [],
}) => {
    const foundShop = await findShopById({ shop_id: product_shop });
    if (!foundShop) throw new NotFound("Shop not found!");

    const newSpu = await Spu.create({
        product_id: randomId(),
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_category,
        product_shop,
        product_attributes,
        product_quantity,
        product_variations,
    });
    let skus = [];
    if (newSpu && sku_list.length > 0) {
        skus = await newSku({ sku_list, product_id: newSpu.product_id });
    }
    //sync data via elasticsearch (search.service)
    await indexProductToES(newSpu.toObject ? newSpu.toObject() : newSpu, skus);
    // return
    return newSpu;
};

export const getSpu = async ({ spu_id }) => {
    const spu = await Spu.findOne({
        product_id: spu_id,
        isPublished: true,
    });
    if (!spu) throw new NotFound("Not Found product!");
    const skus = await getAllSku({ product_id: spu_id });
    return {
        spu: _.omit(spu, ["_v", "updatedAt"]),
        sku_list: skus,
    };
};

export const updateSpuWithSkus = async ({ product_id, updateData }) => {
    const spu = await Spu.findOne({ product_id, isPublished: true });
    if (!spu) throw new NotFound("Not Found product!");
    const {sku_list, ...spuFields }  = updateData;
    let newSkuList 
    //update skus
    if(sku_list && sku_list.length > 0){
        newSkuList = await replaceAllSkus({ sku_list, product_id: spu.product_id });
    }
    //update Spu
    const newSpu = await Spu.findOneAndUpdate(
        { product_id: spu.product_id },
        {$set: spuFields},
        { new: true }
    );

    await indexProductToES(newSpu.toObject(), newSkuList)

    return newSpu;
};
