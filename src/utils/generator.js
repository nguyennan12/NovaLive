// utils/id.generator.js — tập trung 1 chỗ
import { nanoid } from 'nanoid'
import { customAlphabet } from 'nanoid'

const generate = (prefix) => `${prefix}-${nanoid(8).toUpperCase()}`

export const generateSpuId = () => {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const nanoid = customAlphabet(alphabet, 8)
  return `SPU-${nanoid()}`
}

export const generateSkuId = (spuId, tierIdx = []) => {
  const spuCore = spuId.split('-')[1] || spuId
  const tierPart = tierIdx.length > 0 ? tierIdx.join('') : '00'
  return `SKU-${spuCore}-${tierPart}`
}

export const generateAttrId = () => generate('ATTR')
export const generateShopId = () => generate('SHOP')
export const generateOrderId = () => generate('ORD')
export const generateCatId = () => generate('CAT')