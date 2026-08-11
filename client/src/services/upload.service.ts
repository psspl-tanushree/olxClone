import { api } from '../common/axiosInstance';

/**
 * Uploads image files to Cloudinary via the backend.
 * @param files - FileList from an `<input type="file" multiple>` element (max 5 files)
 * @returns Array of public Cloudinary URLs for the uploaded images
 * @throws Normalized error if upload fails or file validation fails
 */
export const uploadImages = async (files: FileList): Promise<string[]> => {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('files', file));
  const response = await api.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.urls;
};
