import { getElasticsearch } from "../dbs/init.elasticsearch.js";


export const indexProductToES = async (spu, sku_list) => {
    const esClient = getElasticsearch()
    try {
        // mapping data sang ES format
        const doc = {
            product_id: spu.product_id,
            product_name: spu.product_name,
            product_description: spu.product_description,
            product_thumb: spu.product_thumb,
            product_price: spu.product_price,
            product_category: spu.product_category,
            product_shop: spu.product_shop,
            product_attributes: spu.product_attributes,
            product_quantity: spu.product_quantity,
            product_variations: spu.product_variations,
            sku_list: sku_list.map((sku) => ({
                sku_id: sku.sku_id,
                sku_price: sku.sku_price,
                sku_stock: sku.sku_stock,
                sku_tier_index: sku.sku_tier_index,
            })),
        };

        await esClient.index({
            index: "products",
            id: spu.product_id,
            document: doc,
        });

        console.log(`✅ Indexed product ${spu.product_id} to Elasticsearch`);
    } catch (error) {
        console.error("❌ Error indexing product to Elasticsearch:", error);
    }
};

export const searchProductByUser = async ({ keySearch, size = 10, from = 0 }) => {
  const esClient = getElasticsearch();

  const result = await esClient.search({
    index: "products",
    from,
    size,
    query: {
      multi_match: {
        query: keySearch,
        fields: ["product_name^2", "product_description"] // product_name được boost độ ưu tiên
      }
    },
    highlight: {
      fields: {
        product_name: {},
        product_description: {}
      }
    }
  });

  return result.hits.hits.map(hit => ({
    ...hit._source,
    highlight: hit.highlight || {}
  }));
};