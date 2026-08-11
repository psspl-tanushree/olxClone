import { api } from '../common/axiosInstance';

/**
 * Fetches all top-level categories with their subcategories.
 * @returns Array of `Category` objects (hierarchical)
 * @throws Normalized error if request fails
 */
export const fetchCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

/**
 * Fetches a single category by its URL slug.
 * @param slug - The category's unique slug identifier
 * @returns `Category` object with subcategories
 * @throws Normalized error if category not found
 */
export const fetchCategoryBySlug = async (slug: string) => {
  const response = await api.get(`/categories/${slug}`);
  return response.data;
};
