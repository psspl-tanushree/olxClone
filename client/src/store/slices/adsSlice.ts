import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchAllAds,
  fetchAdById,
  fetchMyAds,
  createAd,
  updateAd,
  deleteAd,
  AdFilters,
  CreateAdPayload,
} from '../../services/ads.service';
import { Ad, PaginatedAds } from '../../types';

interface AdsState {
  ads: Ad[];
  currentAd: Ad | null;
  myAds: Ad[];
  total: number;
  page: number;
  loading: boolean;
  error: string | null;
}

const initialState: AdsState = {
  ads: [],
  currentAd: null,
  myAds: [],
  total: 0,
  page: 1,
  loading: false,
  error: null,
};

export const fetchAllAdsHandler = createAsyncThunk<PaginatedAds, AdFilters>(
  'ads/fetchAll',
  (filters: AdFilters, { rejectWithValue }) =>
    fetchAllAds(filters).catch((err: Error) => rejectWithValue(err.message))
);

export const fetchAdByIdHandler = createAsyncThunk<Ad, number>(
  'ads/fetchById',
  (id: number, { rejectWithValue }) =>
    fetchAdById(id).catch((err: Error) => rejectWithValue(err.message))
);

export const fetchMyAdsHandler = createAsyncThunk<Ad[], void>(
  'ads/fetchMy',
  (_: void, { rejectWithValue }) =>
    fetchMyAds().catch((err: Error) => rejectWithValue(err.message))
);

export const createAdHandler = createAsyncThunk<Ad, CreateAdPayload>(
  'ads/create',
  (data: CreateAdPayload, { rejectWithValue }) =>
    createAd(data).catch((err: Error) => rejectWithValue(err.message))
);

export const updateAdHandler = createAsyncThunk<
  Ad,
  { id: number; payload: Partial<CreateAdPayload> & { status?: string } }
>(
  'ads/update',
  (data, { rejectWithValue }) =>
    updateAd(data.id, data.payload).catch((err: Error) => rejectWithValue(err.message))
);

export const deleteAdHandler = createAsyncThunk<void, number>(
  'ads/delete',
  (id: number, { rejectWithValue }) =>
    deleteAd(id).catch((err: Error) => rejectWithValue(err.message))
);

const adsSlice = createSlice({
  name: 'adsSlice',
  initialState,
  reducers: {
    clearCurrentAd: (state) => {
      state.currentAd = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAdsHandler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAdsHandler.fulfilled, (state, action: PayloadAction<PaginatedAds>) => {
        state.loading = false;
        state.ads = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(fetchAllAdsHandler.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load ads.';
      });

    builder
      .addCase(fetchAdByIdHandler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdByIdHandler.fulfilled, (state, action: PayloadAction<Ad>) => {
        state.loading = false;
        state.currentAd = action.payload;
      })
      .addCase(fetchAdByIdHandler.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load ad.';
      });

    builder
      .addCase(fetchMyAdsHandler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAdsHandler.fulfilled, (state, action: PayloadAction<Ad[]>) => {
        state.loading = false;
        state.myAds = action.payload;
      })
      .addCase(fetchMyAdsHandler.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load your ads.';
      });

    builder
      .addCase(createAdHandler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdHandler.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAdHandler.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to create ad.';
      });

    builder.addCase(updateAdHandler.fulfilled, (state, action: PayloadAction<Ad>) => {
      state.myAds = state.myAds.map((ad) =>
        ad.id === action.payload.id ? action.payload : ad
      );
    });

    builder
      .addCase(deleteAdHandler.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAdHandler.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteAdHandler.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to delete ad.';
      });
  },
});

export const { clearCurrentAd } = adsSlice.actions;
export default adsSlice.reducer;
