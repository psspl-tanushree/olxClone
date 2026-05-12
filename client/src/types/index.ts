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
