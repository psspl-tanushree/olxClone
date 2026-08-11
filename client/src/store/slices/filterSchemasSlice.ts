import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CategoryFilterSchema } from '../../types';
import { fetchSchemaBySlug } from '../../services/filterSchemas.service';

interface FilterSchemasState {
  schemas: Record<string, CategoryFilterSchema>; // keyed by categorySlug
  loading: Record<string, boolean>;
}

const initialState: FilterSchemasState = {
  schemas: {},
  loading: {},
};

export const fetchFilterSchemaHandler = createAsyncThunk(
  'filterSchemas/fetchBySlug',
  async (slug: string) => {
    const schema = await fetchSchemaBySlug(slug);
    return schema;
  },
);

const filterSchemasSlice = createSlice({
  name: 'filterSchemas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilterSchemaHandler.pending, (state, action) => {
        state.loading[action.meta.arg] = true;
      })
      .addCase(fetchFilterSchemaHandler.fulfilled, (state, action) => {
        const schema = action.payload;
        state.schemas[schema.categorySlug] = schema;
        state.loading[schema.categorySlug] = false;
      })
      .addCase(fetchFilterSchemaHandler.rejected, (state, action) => {
        state.loading[action.meta.arg] = false;
      });
  },
});

export default filterSchemasSlice.reducer;
