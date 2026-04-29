import { formatStringToSlug } from "./formatters";

export const buildQueryParams = (filters) => {
    const params = {};
    const categories = Array.isArray(filters.category)
        ? filters.category
        : filters.category
            ? [filters.category]
            : [];

    const validCategories = categories.filter(c => c && c !== 'all');
    if (validCategories.length > 0) {
        params.category = validCategories.map(formatStringToSlug);
    }

    if (filters.status && filters.status !== 'all') { params.status = filters.status; }
    if (filters.stock && filters.stock !== 'all') { params.stock = filters.stock; }
    if (filters.minPrice !== undefined && filters.minPrice > 0) { params.minPrice = filters.minPrice; }
    if (filters.maxPrice !== undefined) { params.maxPrice = filters.maxPrice; }

    switch (filters.sort) {
        case 'price_asc':
            params.sortBy = 'price';
            params.sortOrder = 'asc';
            break;
        case 'price_desc':
            params.sortBy = 'price';
            params.sortOrder = 'desc';
            break;
        case 'name_az':
            params.sortBy = 'name';
            params.sortOrder = 'desc';
            break;
        case 'newest':
        default:
            params.sortBy = 'time';
            params.sortOrder = 'desc';
            break;
    }

    return params;
}

export const buildFlattenedSkus = (skus) => {
    const list = []
    skus.forEach(spu => {
        if (spu.has_variations && spu.variation_stocks?.length > 0) {
            spu.variation_stocks.forEach(sku => {
                list.push({
                    sku_id: sku.sku_id,
                    spu_id: spu._id,
                    spu_name: spu.spu_name,
                    spu_code: spu.spu_code,
                    sku_name: sku.sku_name || Object.values(sku.attributes || {}).join(' - ') || 'Variation',
                    sku_code: sku.sku_code,
                    stock: sku.stock,
                    attributes: sku.attributes
                })
            })
        } else {
            list.push({
                spu_id: spu._id,
                spu_id: spu._id,
                spu_name: spu.spu_name,
                spu_code: spu.spu_code,
                sku_name: 'No variation',
                sku_code: 'N/A',
                stock: spu.total_stock,
                attributes: []
            })
        }
    })
    return list
}