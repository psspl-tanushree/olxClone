// ─── Filter Schema Types ─────────────────────────────────────────────────────

export type FieldType =
  | 'dropdown'
  | 'multi-select'
  | 'radio'
  | 'checkbox'
  | 'range'
  | 'text'
  | 'number';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FilterFieldSchema {
  key: string;
  label: string;
  type: FieldType;
  options?: FieldOption[];
  dependentOptions?: Record<string, FieldOption[]>;
  dependsOn?: string;
  required?: boolean;
  showInFilters?: boolean;
  showInCreateAd?: boolean;
  priority: number;
  placeholder?: string;
  unit?: string;
  seoParam?: string;
  validation?: { min?: number; max?: number };
}

export interface CategoryFilterSchema {
  categorySlug: string;
  categoryName: string;
  icon: string;
  filters: FilterFieldSchema[];
}

// Attribute values in an ad (key → scalar or array for multi-select)
export type AdAttributes = Record<string, string | string[]>;

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Ad {
  id: number;
  title: string;
  description?: string;
  price: number;
  images: string[];
  categoryId: number;
  userId: number;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
  status: 'active' | 'sold' | 'inactive';
  views: number;
  featured?: boolean;
  featuredUntil?: string;
  attributes?: AdAttributes;
  createdAt: string;
  category?: { id: number; name: string; slug: string };
  user?: { id: number; name: string; phone?: string; city?: string; avatar?: string };
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  avatar?: string;
  role?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  parentId?: number;
  subcategories?: Category[];
}

export interface Favourite {
  id: number;
  userId: number;
  adId: number;
  ad: Ad;
}

export interface PaginatedAds {
  data: Ad[];
  total: number;
  page: number;
  limit?: number;
}
