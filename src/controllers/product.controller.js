import { getSpu, newSpu, updateSpuWithSkus } from "../services/spu.service.js";
import { SuccessResponse } from "../core/success.response.js";
import ProductService from "../services/product.service.js";
import { getAllSku, getSku } from "../services/sku.service.js";
import { searchProductByUser } from "../utils/elasticsearch.js";

class ProductController {
    // sku spu
    findOneSku = async (req, res, next) => {
        new SuccessResponse({
            message: "Get sku successfully",
            metadata: await getSku({ ...req.query }),
        }).send(res);
    };

    findSkusBySpu = async (req, res, next) => {
        new SuccessResponse({
            message: "Get skus successfully",
            metadata: await getAllSku({ ...req.query }),
        }).send(res);
    };

    findOneSpu = async (req, res, next) => {
        new SuccessResponse({
            message: "Get spu successfully",
            metadata: await getSpu({ spu_id: req.query.product_id }),
        }).send(res);
    };

    createSpu = async (req, res, next) => {
        new SuccessResponse({
            message: "Create SPU successfully!",
            metadata: await newSpu({ ...req.body, product_shop: req.user.userId }),
        }).send(res);
    };

    updateSpuWithSkus = async(req, res, next) => {
        new SuccessResponse({
            message: "Update Spu successfully!",
            metadata: await updateSpuWithSkus({ product_id: req.params.product_id, updateData: req.body }) 
        }).send(res)
    }

    searchSpu  = async(req, res, next) => {
        const { q } = req.query
        new SuccessResponse({
            message: "Search Spu successfully!",
            metadata: await searchProductByUser({ keySearch: q }) 
        }).send(res)
    }
    //
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Create Product Successfully!",
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId,
            }),
        }).send(res);
    };
    //update
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Update product successfully!",
            metadata: await ProductService.updateProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                },
                req.params.productId
            ),
        }).send(res);
    };
    //put
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish product successfully!",
            metadata: await ProductService.publishProductByShop(req.user.userId, req.params.id),
        }).send(res);
    };

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "UnPublish product successfully!",
            metadata: await ProductService.unPublishProductByShop(req.user.userId, req.params.id),
        }).send(res);
    };
    //query
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get List Draft successfully!",
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };
    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get List Publish successfully!",
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };
    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get List Search successfully!",
            metadata: await ProductService.searchProducts(req.params),
        }).send(res);
    };
    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "Get Products successfully!",
            metadata: await ProductService.findAllProducts(req.query),
        }).send(res);
    };
    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get Product successfully!",
            metadata: await ProductService.findProduct({
                product_id: req.params.product_id,
            }),
        }).send(res);
    };
}

export default new ProductController();
