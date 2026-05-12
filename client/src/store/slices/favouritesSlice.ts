import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchFavourites, toggleFavourite } from '../../services/favourites.service';
import { Ad, Favourite } from '../../types';

interface FavouritesState {
  favourites: Favourite[];
  loading: boolean;
  error: string | null;
}

const initialState: FavouritesState = {
  favourites: [],
  loading: false,
  error: null,
};

export const fetchFavouritesHandler = createAsyncThunk<Favourite[], void>(
  'favourites/fetchAll',
  (_: void, { rejectWithValue }) =>
    fetchFavourites().catch((err: Error) => rejectWithValue(err.message))
);

export const toggleFavouriteHandler = createAsyncThunk<
  { adId: number; saved: boolean; ad: Ad },
  { adId: number; ad: Ad }
>(
  'favourites/toggle',
  ({ adId, ad }, { rejectWithValue }) =>
    toggleFavourite(adId)
      .then((result: { saved: boolean }) => ({ adId, saved: result.saved, ad }))
      .catch((err: Error) => rejectWithValue(err.message))
);

const favouritesSlice = createSlice({
  name: 'favouritesSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavouritesHandler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavouritesHandler.fulfilled, (state, action: PayloadAction<Favourite[]>) => {
        state.loading = false;
        state.favourites = action.payload;
      })
      .addCase(fetchFavouritesHandler.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load saved ads.';
      });

    builder.addCase(
      toggleFavouriteHandler.fulfilled,
      (state, action: PayloadAction<{ adId: number; saved: boolean; ad: Ad }>) => {
        const { adId, saved, ad } = action.payload;
        if (saved) {
          // Add to list if not already present (optimistic update)
          if (!state.favourites.some((f) => f.adId === adId)) {
            state.favourites.push({ id: Date.now(), userId: 0, adId, ad });
          }
        } else {
          state.favourites = state.favourites.filter((f) => f.adId !== adId);
        }
      }
    );
  },
});

export default favouritesSlice.reducer;
