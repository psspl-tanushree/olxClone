import api from '../api/axios';
import { CategoryFilterSchema } from '../types';

export const fetchAllSchemas = async (): Promise<CategoryFilterSchema[]> => {
  const { data } = await api.get('/filter-schemas');
  return data;
};

export const fetchSchemaBySlug = async (slug: string): Promise<CategoryFilterSchema> => {
  const { data } = await api.get(`/filter-schemas/${slug}`);
  return data;
};
