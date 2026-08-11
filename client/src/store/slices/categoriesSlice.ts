import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchCategories } from '../../services/categories.service';
import { Category } from '../../types';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategoriesHandler = createAsyncThunk<Category[], void>(
  'categories/fetchAll',
  (_: void, { rejectWithValue }) =>
    fetchCategories().catch((err: Error) => rejectWithValue(err.message))
);

const categoriesSlice = createSlice({
  name: 'categoriesSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesHandler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesHandler.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesHandler.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load categories.';
      });
  },
});

export default categoriesSlice.reducer;
