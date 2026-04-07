import { ElasticClient } from '#database/init.elasticsearch.js'
import { spuModel } from '#models/spu.model.js'
import { ELASTIC_INDEX } from '#utils/constant.js'

export const transformSPUtoES = (doc) => {
  return {
    mongo_id: doc._id.toString(),
    spu_name: doc.spu_name,
    spu_slug: doc.spu_slug,
    spu_description: doc.spu_description,
    spu_price: doc.spu_price,
    spu_quantity: doc.spu_quantity,
    spu_category: doc.spu_category,
    spu_ratingsAvg: doc.spu_ratingsAvg,
    spu_shopId: doc.spu_shopId?.toString(),

    spu_attributes: doc.spu_attributes?.map(attr => ({
      attr_id: attr.attr_id,
      attr_name: attr.attr_name,
      attr_value: attr.attr_value
    })),

    live: doc.live?.is_live ? {
      is_live: doc.live.is_live,
      live_price: doc.live.live_price,
      start_time: doc.live.start_time,
      end_time: doc.live.end_time,
      sort_order: doc.live.sort_order,
      is_pin: doc.live.is_pin,
      sold_count: doc.live.sold_count,
      view_count: doc.live.view_count
    } : { is_live: false },

    isPublished: doc.isPublished,
    isDeleted: doc.isDeleted,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  }
}

export const shouldSync = (doc) => doc.isDeleted === false


export const syncProdcutToEs = async (productId) => {
  const updatedProduct = await spuModel.findById(productId)
  if (updatedProduct && shouldSync(updatedProduct)) {
    const result = await ElasticClient.index({
      index: ELASTIC_INDEX.PRODUCT,
      id: updatedProduct._id.toString(),
      document: transformSPUtoES(updatedProduct)
    })
    return result
  }

}

