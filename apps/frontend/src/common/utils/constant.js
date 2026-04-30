export const API_ROOT = 'http://localhost:3031/v1/api'

export const LIMIT_PRODUCTS = 30

export const LIMIT = {
  PRODUCTS: 30,
  INVENTORY: 10,
  DISCOUNT: 20
}

export const PRICE_SLIDER_MIN = 0
export const PRICE_SLIDER_MAX = 50_000_000
export const PRICE_SLIDER_STEP = 500_000

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá: Thấp → Cao' },
  { value: 'price_desc', label: 'Giá: Cao → Thấp' },
  { value: 'name_az', label: 'Tên A → Z' }
]

export const DEFAULT_FILTERS = { priceRange: [PRICE_SLIDER_MIN, PRICE_SLIDER_MAX], sort: 'newest' }