import { api } from '../common/axiosInstance';
import { AdAttributes } from '../types';

export interface AdFilters {
  search?: string;
  categoryId?: number;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  /** Category-specific dynamic attributes sent as `attr[key]=value` */
  attr?: AdAttributes;
}

export interface CreateAdPayload {
  title: string;
  description?: string;
  price: number;
  images?: string[];
  categoryId: number;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
  attributes?: AdAttributes;
}

/**
 * Fetches paginated ads with optional filters.
 * @param filters - Search query, category, city, price range, pagination
 * @returns Paginated response `{ data: Ad[], total, page }`
 * @throws Normalized error with user-facing message from response interceptor
 */
export const fetchAllAds = async (filters: AdFilters = {}) => {
  const { attr, ...rest } = filters;

  // Flatten attr object into query params that NestJS can parse as attr[key]=value
  // Axios serializes nested objects as attr[brand]=maruti automatically
  const params: Record<string, unknown> = { ...rest };
  if (attr && Object.keys(attr).length > 0) {
    params.attr = attr;
  }

  const response = await api.get('/ads', {
    params,
    // Ensure nested object serialization works: attr[brand]=maruti
    paramsSerializer: (p) => {
      const parts: string[] = [];
      for (const [key, val] of Object.entries(p)) {
        if (val === undefined || val === null || val === '') continue;
        if (key === 'attr' && typeof val === 'object' && !Array.isArray(val)) {
          for (const [attrKey, attrVal] of Object.entries(val as Record<string, string | string[]>)) {
            if (!attrVal || (Array.isArray(attrVal) && attrVal.length === 0)) continue;
            if (Array.isArray(attrVal)) {
              attrVal.forEach((v) => parts.push(`attr[${attrKey}]=${encodeURIComponent(v)}`));
            } else {
              parts.push(`attr[${attrKey}]=${encodeURIComponent(attrVal)}`);
            }
          }
        } else {
          parts.push(`${key}=${encodeURIComponent(String(val))}`);
        }
      }
      return parts.join('&');
    },
  });
  return response.data;
};

/**
 * Fetches a single ad by ID.
 * @param id - The ad's numeric ID
 * @returns Full `Ad` object including user and category info
 * @throws Normalized error if ad not found or request fails
 */
export const fetchAdById = async (id: number) => {
  const response = await api.get(`/ads/${id}`);
  return response.data;
};

/**
 * Fetches the authenticated user's own ads.
 * @returns Array of `Ad` objects belonging to the current user
 * @throws Normalized error if not authenticated or request fails
 */
export const fetchMyAds = async () => {
  const response = await api.get('/ads/my');
  return response.data;
};

/**
 * Creates a new ad.
 * @param data - Ad creation payload
 * @returns The newly created `Ad` object
 * @throws Normalized error with validation messages on 400/422
 */
export const createAd = async (data: CreateAdPayload) => {
  const response = await api.post('/ads', data);
  return response.data;
};

/**
 * Updates an existing ad.
 * @param id - ID of the ad to update
 * @param data - Partial ad fields to update
 * @returns The updated `Ad` object
 * @throws Normalized error if unauthorized or request fails
 */
export const updateAd = async (
  id: number,
  data: Partial<CreateAdPayload> & { status?: string }
) => {
  const response = await api.patch(`/ads/${id}`, data);
  return response.data;
};

/**
 * Deletes an ad by ID.
 * @param id - ID of the ad to delete
 * @throws Normalized error if unauthorized or request fails
 */
export const deleteAd = async (id: number) => {
  const response = await api.delete(`/ads/${id}`);
  return response.data;
};
