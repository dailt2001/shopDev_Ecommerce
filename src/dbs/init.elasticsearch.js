import { Client } from "@elastic/elasticsearch"
import { ClientClosedError } from "redis"

let clients = {}

const instanceEventListener = async(elasticClient) => {
    try {
        await elasticClient.info()
        console.log("✅ Connected to Elasticsearch")
    } catch (error) {
        console.error("❌ Elasticsearch connection failed:", error.message)
    throw error
    }
}

export const initElasticsearch = async({ 
    ELASTICSEARCH_IS_ENABLED,
    ELASTICSEARCH_HOST = "https://localhost:9200",
    ELASTICSEARCH_USERNAME = "elastic",
    ELASTICSEARCH_PASSWORD = "trongdai010203"
}) => {
    if (!ELASTICSEARCH_IS_ENABLED) {
    console.log("🔌 Elasticsearch is disabled in config.")
    return null
    }
    const elasticClient = new Client({
        node: ELASTICSEARCH_HOST,
        auth: {
            username: ELASTICSEARCH_USERNAME,
            password: ELASTICSEARCH_PASSWORD
        },
        tls: {
            rejectUnauthorized: false 
      }
    })
    clients.elasticClient = elasticClient
    await instanceEventListener(elasticClient)
    return elasticClient
}

export const getElasticsearch = () => clients.elasticClient

export const closeElasticsearch = async() => {

}