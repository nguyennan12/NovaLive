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