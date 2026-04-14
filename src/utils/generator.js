import { customAlphabet } from 'nanoid'

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const nanoid = customAlphabet(alphabet, 8)

const generate = (prefix) =>
  `${prefix}-${nanoid().toUpperCase()}`

export const generateSpuId = () => {
  return `SPU-${nanoid()}`
}

export const generateSkuId = (spuId, tierIdx = []) => {
  const spuCore = spuId.split('-')[1] || spuId
  const tierPart = tierIdx.length > 0 ? tierIdx.join('') : '00'
  return `SKU-${spuCore}-${tierPart}`
}

export const generateOrderCode = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  return `ORD-${date}-${nanoid()}`
}

export const generateAttrId = () => generate('ATTR')
export const generateShopId = () => generate('SHOP')
export const generateCatId = () => generate('CAT')
export const generateDisId = () => generate('DISC')
export const generateLiveId = () => generate('LIVE')
export const generateCommentId = () => generate('CMT')