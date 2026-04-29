import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllProductsAPI, queryProductAPI } from '~/common/apis/services/productService'
import { buildQueryParams } from '~/common/utils/builder'
import { PRICE_SLIDER_MAX, PRICE_SLIDER_MIN } from '../configs/homeFilter.config'

const toArray = (data) => {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.products)) return data.products
  return []
}

const sortList = (list, sort) => {
  const arr = [...list]
  switch (sort) {
    case 'price_asc': return arr.sort((a, b) => (a.spu_price || 0) - (b.spu_price || 0))
    case 'price_desc': return arr.sort((a, b) => (b.spu_price || 0) - (a.spu_price || 0))
    case 'name_az': return arr.sort((a, b) => (a.spu_name || '').localeCompare(b.spu_name || ''))
    default: return arr
  }
}

export const useHomeProducts = (filters = {}) => {
  const [minPrice, maxPrice] = filters.priceRange ?? [PRICE_SLIDER_MIN, PRICE_SLIDER_MAX]

  /* Chỉ gọi queryProductAPI khi slider lệch khỏi giá trị mặc định */
  const isFiltering = minPrice > PRICE_SLIDER_MIN || maxPrice < PRICE_SLIDER_MAX

  const queryString = useMemo(() => {
    if (!isFiltering) return ''
    const params = buildQueryParams({
      sort: filters.sort,
      minPrice,
      /* Không gửi maxPrice nếu là giá trị max để tránh lọc sản phẩm giá cao hơn slider max */
      ...(maxPrice < PRICE_SLIDER_MAX ? { maxPrice } : {})
    })
    return new URLSearchParams(params).toString()
  }, [isFiltering, minPrice, maxPrice, filters.sort])

  /* Fetch all — dùng khi không lọc giá */
  const { data: rawAll = [], isLoading } = useQuery({
    queryKey: ['home_products'],
    queryFn: () => getAllProductsAPI({ page: 1, limit: 48 }),
    staleTime: 5 * 60 * 1000,
    enabled: !isFiltering
  })

  /* Fetch filtered — dùng khi user kéo slider */
  const { data: rawFiltered = [], isLoading: filterLoading } = useQuery({
    queryKey: ['home_filtered_price', queryString],
    queryFn: () => queryProductAPI(queryString),
    staleTime: 60 * 1000,
    enabled: isFiltering && !!queryString
  })

  const allProducts = useMemo(() => toArray(rawAll), [rawAll])
  const filteredProducts = useMemo(
    () => sortList(toArray(rawFiltered), filters.sort),
    [rawFiltered, filters.sort]
  )

  /* Sections khi không lọc */
  const sortedAll = useMemo(() => sortList(allProducts, filters.sort), [allProducts, filters.sort])
  const featuredProducts = useMemo(() => sortedAll.slice(0, 10), [sortedAll])
  const bestSellers = useMemo(
    () => [...allProducts].sort((a, b) => (b.total_sold || 0) - (a.total_sold || 0)).slice(0, 6),
    [allProducts]
  )
  const newArrivals = useMemo(() => sortedAll, [sortedAll])

  return {
    isFiltering,
    filteredProducts,
    filterLoading,
    featuredProducts,
    bestSellers,
    newArrivals,
    isLoading
  }
}
