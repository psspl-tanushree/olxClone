import { api } from '../common/axiosInstance';

/**
 * Fetches all ads saved by the authenticated user.
 * @returns Array of `Favourite` objects including the full ad details
 * @throws Normalized error if not authenticated or request fails
 */
export const fetchFavourites = async () => {
  const response = await api.get('/favourites');
  return response.data;
};

/**
 * Toggles the saved state of an ad for the current user.
 * @param adId - ID of the ad to save or unsave
 * @returns `{ saved: boolean }` indicating the new saved state
 * @throws Normalized error if not authenticated or request fails
 */
export const toggleFavourite = async (adId: number) => {
  const response = await api.post(`/favourites/${adId}/toggle`);
  return response.data;
};
