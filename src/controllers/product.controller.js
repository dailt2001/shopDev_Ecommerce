import { SuccessResponse } from "../core/success.response.js";
import ProductService from "../services/product.service.js";

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Create Product Successfully!",
            metadata: await ProductService.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            ),
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
            metadata: await ProductService.publishProductByShop(
                req.user.userId,
                req.params.id
            ),
        }).send(res);
    };

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "UnPublish product successfully!",
            metadata: await ProductService.unPublishProductByShop(
                req.user.userId,
                req.params.id
            ),
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
    findAllProducts= async (req, res, next) => {
        new SuccessResponse({
            message: "Get Products successfully!",
            metadata: await ProductService.findAllProducts(req.query),
        }).send(res);
    };
    findProduct= async (req, res, next) => {
        new SuccessResponse({
            message: "Get Product successfully!",
            metadata: await ProductService.findProduct({
                product_id: req.params.product_id
            }),
        }).send(res);
    };
}

export default new ProductController();
