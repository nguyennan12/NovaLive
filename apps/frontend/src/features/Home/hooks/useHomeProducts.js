/* eslint-disable indent */
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllProductsAPI, queryProductAPI } from '~/common/apis/services/productService'
import { buildQueryParams } from '~/common/utils/builder'

const toArray = (data) => {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.products)) return data.products
  return []
}

export const useHomeProducts = (filters = {}) => {
  const isFiltering = filters.category !== 'all'

  const { data: rawAll = [], isLoading } = useQuery({
    queryKey: ['home_products'],
    queryFn: () => getAllProductsAPI({ page: 1, limit: 24 }),
    staleTime: 5 * 60 * 1000,
    enabled: !isFiltering
  })

  const queryString = useMemo(() => {
    if (!isFiltering) return ''
    const params = buildQueryParams({ ...filters })
    return new URLSearchParams(params).toString()
  }, [filters, isFiltering])

  const { data: rawFiltered = [], isLoading: filterLoading } = useQuery({
    queryKey: ['home_filtered', queryString],
    queryFn: () => queryProductAPI(queryString),
    enabled: isFiltering && !!queryString
  })

  const allProducts = useMemo(() => toArray(rawAll), [rawAll])

  const sortedProducts = useMemo(() => {
    const list = [...allProducts]
    switch (filters.sort) {
      case 'price_asc': return list.sort((a, b) => (a.spu_price || 0) - (b.spu_price || 0))
      case 'price_desc': return list.sort((a, b) => (b.spu_price || 0) - (a.spu_price || 0))
      case 'name_az': return list.sort((a, b) => (a.spu_name || '').localeCompare(b.spu_name || ''))
      default: return list
    }
  }, [allProducts, filters.sort])

  const featuredProducts = useMemo(() => sortedProducts.slice(0, 10), [sortedProducts])

  const bestSellers = useMemo(
    () => [...allProducts].sort((a, b) => (b.total_sold || 0) - (a.total_sold || 0)).slice(0, 6),
    [allProducts]
  )

  const newArrivals = useMemo(() => sortedProducts, [sortedProducts])
  console.log("🚀 ~ useHomeProducts ~ newArrivals:", newArrivals)

  return {
    isFiltering,
    filteredProducts: toArray(rawFiltered),
    filterLoading,
    featuredProducts,
    bestSellers,
    newArrivals,
    isLoading
  }
}
