import { ElasticClient } from '#infrastructure/database/init.elasticsearch.js'

await ElasticClient.indices.create({
  index: 'products',
  settings: {
    analysis: {
      analyzer: {
        vietnamese_analyzer: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase', 'asciifolding']
        }
      }
    }
  },
  body: {
    mappings: {
      properties: {
        mongo_id: { type: 'keyword' },
        spu_name: {
          type: 'text',
          analyzer: 'vietnamese_analyzer',
          fields: {
            keyword: { type: 'keyword' }
          }
        },
        spu_slug: { type: 'keyword' },
        spu_description: { type: 'text', analyzer: 'vietnamese_analyzer' },
        spu_price: { type: 'double' },
        spu_quantity: { type: 'integer' },
        spu_category: { type: 'keyword' },
        spu_ratingsAvg: { type: 'half_float' },
        spu_thumb: { type: 'text' },
        total_sold: { type: 'integer' },
        spu_code: { type: 'text' },
        spu_shopId: { type: 'keyword' },
        spu_attributes: {
          type: 'nested',
          properties:
          {
            attr_id: { type: 'keyword' },
            attr_name: { type: 'keyword' },
            attr_value: { type: 'keyword' }
          }
        },
        spu_variations: { enabled: false },
        isPublished: { type: 'boolean' },
        isDeleted: { type: 'boolean' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' }
      }
    }
  }
})

console.log('Done')
process.exit(0)``