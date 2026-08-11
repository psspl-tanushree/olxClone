import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal, ChevronDown, X, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { RootState, AppDispatch } from '../store';
import { fetchAllAdsHandler } from '../store/slices/adsSlice';
import { fetchCategoriesHandler } from '../store/slices/categoriesSlice';
import { fetchFavouritesHandler, toggleFavouriteHandler } from '../store/slices/favouritesSlice';
import AdCard from '../components/AdCard';
import DynamicFilterPanel from '../components/filters/DynamicFilterPanel';
import { Ad, AdAttributes } from '../types';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

const INDIAN_CITIES = [
  'All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow',
];

const PAGE_LIMIT = 12;

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Parse all `attr_*` URL params into an AdAttributes map */
function parseAttrParams(params: URLSearchParams): AdAttributes {
  const attrs: AdAttributes = {};
  params.forEach((value, key) => {
    if (key.startsWith('attr_')) {
      const attrKey = key.slice(5); // strip 'attr_' prefix
      // Multi-select values are comma-separated in the URL
      attrs[attrKey] = value.includes(',') ? value.split(',') : value;
    }
  });
  return attrs;
}

/** Serialize AdAttributes back to URL params (attr_brand=maruti, etc.) */
function buildAttrParams(attrs: AdAttributes): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (!value || (Array.isArray(value) && value.length === 0)) continue;
    out[`attr_${key}`] = Array.isArray(value) ? value.join(',') : value;
  }
  return out;
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '...')[] = [1];
  if (current > 3) pages.push('...');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-olx-border rounded overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-2.5 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

function PriceRangeFilter({
  onApply, onCancel, initialMin, initialMax,
}: {
  onApply: (min: string, max: string) => void;
  onCancel: () => void;
  initialMin: string;
  initialMax: string;
}) {
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);

  return (
    <div className="bg-white border border-olx-border rounded p-4">
      <h3 className="font-bold text-olx-text text-sm mb-3">Price Range (₹)</h3>
      <div className="space-y-2">
        <input type="number" placeholder="Min ₹" value={min} onChange={(e) => setMin(e.target.value)}
          className="w-full border border-olx-border rounded px-3 py-1.5 text-sm focus:outline-none focus:border-olx-teal" />
        <input type="number" placeholder="Max ₹" value={max} onChange={(e) => setMax(e.target.value)}
          className="w-full border border-olx-border rounded px-3 py-1.5 text-sm focus:outline-none focus:border-olx-teal" />
        <div className="flex gap-2">
          <button onClick={() => onApply(min, max)}
            className="flex-1 bg-olx-teal text-white text-sm py-1.5 rounded hover:bg-olx-teal-hover transition-colors">
            Apply
          </button>
          <button onClick={() => { setMin(''); setMax(''); onCancel(); }}
            className="flex-1 bg-white text-olx-muted text-sm py-1.5 rounded border border-olx-border hover:bg-olx-bg transition-colors">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { ads, total, loading } = useSelector((s: RootState) => s.ads);
  const { categories } = useSelector((s: RootState) => s.categories);
  const { favourites } = useSelector((s: RootState) => s.favourites);
  const { user } = useSelector((s: RootState) => s.auth);

  // ── URL-derived state ──────────────────────────────────────────────────────
  const search = searchParams.get('search') || '';
  const categorySlug = searchParams.get('categorySlug') || '';
  const city = searchParams.get('city') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const attrValues = parseAttrParams(searchParams);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceKey, setPriceKey] = useState(0);

  const totalPages = Math.ceil(total / PAGE_LIMIT);

  const isFav = (adId: number) => favourites.some((f) => f.adId === adId || f.ad?.id === adId);

  const handleToggleFav = (adId: number) => {
    if (!user) { navigate('/login'); return; }
    const ad = ads.find((a) => a.id === adId) as Ad;
    if (!ad) return;
    dispatch(toggleFavouriteHandler({ adId, ad })).then((result) => {
      if (toggleFavouriteHandler.fulfilled.match(result)) {
        toast.success(result.payload.saved ? 'Added to saved ads' : 'Removed from saved ads');
      }
    });
  };

  // ── Param helpers ──────────────────────────────────────────────────────────

  const updateFilter = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  /** Update one attribute filter. Serialises multi-select as comma-separated. */
  const updateAttr = useCallback((key: string, value: string | string[]) => {
    const p = new URLSearchParams(searchParams);
    const paramKey = `attr_${key}`;
    const strValue = Array.isArray(value) ? value.join(',') : value;
    if (strValue) p.set(paramKey, strValue); else p.delete(paramKey);
    p.delete('page');
    setSearchParams(p);
  }, [searchParams, setSearchParams]);

  const clearAttrFilters = useCallback(() => {
    const p = new URLSearchParams(searchParams);
    Array.from(p.keys())
      .filter((k) => k.startsWith('attr_'))
      .forEach((k) => p.delete(k));
    p.delete('page');
    setSearchParams(p);
  }, [searchParams, setSearchParams]);

  const handlePriceApply = (min: string, max: string) => {
    const p = new URLSearchParams(searchParams);
    if (min) p.set('minPrice', min); else p.delete('minPrice');
    if (max) p.set('maxPrice', max); else p.delete('maxPrice');
    p.delete('page');
    setSearchParams(p);
  };

  const handlePriceCancel = () => {
    const p = new URLSearchParams(searchParams);
    p.delete('minPrice');
    p.delete('maxPrice');
    p.delete('page');
    setSearchParams(p);
    setPriceKey((k) => k + 1);
  };

  const clearAllFilters = () => {
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    setSearchParams(p);
    setPriceKey((k) => k + 1);
  };

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams);
    if (p === 1) params.delete('page'); else params.set('page', String(p));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Data fetching ──────────────────────────────────────────────────────────

  useEffect(() => { dispatch(fetchCategoriesHandler()); }, [dispatch]);

  useEffect(() => {
    if (user) dispatch(fetchFavouritesHandler());
  }, [dispatch, user]);

  useEffect(() => {
    const selectedCategory = categories.find((c) => c.slug === categorySlug);

    // Build attr object for the API: only non-empty values
    const attr: AdAttributes = {};
    for (const [k, v] of Object.entries(attrValues)) {
      if (v && (Array.isArray(v) ? v.length > 0 : v !== '')) {
        attr[k] = v;
      }
    }

    dispatch(fetchAllAdsHandler({
      search: search || undefined,
      categoryId: selectedCategory?.id || undefined,
      city: city || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page,
      limit: PAGE_LIMIT,
      attr: Object.keys(attr).length > 0 ? attr : undefined,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, search, categorySlug, city, minPrice, maxPrice, page, categories, searchParams]);

  // ── Derived state ──────────────────────────────────────────────────────────

  const hasFilters = minPrice || maxPrice || categorySlug || city ||
    Object.values(attrValues).some((v) => Array.isArray(v) ? v.length > 0 : !!v);

  const sortedAds = [...ads].sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    return 0;
  });

  const selectedCategoryName = categories.find((c) => c.slug === categorySlug)?.name;

  // ── Active filter chips for display ───────────────────────────────────────
  const activeAttrChips: { key: string; label: string }[] = [];
  for (const [k, v] of Object.entries(attrValues)) {
    if (!v || (Array.isArray(v) && v.length === 0)) continue;
    const display = Array.isArray(v) ? v.join(', ') : v;
    activeAttrChips.push({ key: k, label: `${k}: ${display}` });
  }

  return (
    <div className="bg-olx-bg min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-olx-text">
              {loading ? 'Searching…'
                : search ? `Results for "${search}"`
                : selectedCategoryName ?? 'All Ads'}
            </h1>
            {!loading && <p className="text-sm text-olx-muted">{total} results</p>}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select value={sort} onChange={(e) => {
                const p = new URLSearchParams(searchParams);
                if (e.target.value === 'newest') p.delete('sort'); else p.set('sort', e.target.value);
                p.delete('page');
                setSearchParams(p);
              }}
                className="appearance-none bg-white border border-olx-border rounded px-3 py-1.5 text-sm text-olx-text pr-7 focus:outline-none cursor-pointer">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-olx-muted" />
            </div>

            <div className="flex border border-olx-border rounded overflow-hidden bg-white">
              <button onClick={() => setViewMode('grid')}
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-olx-teal text-white' : 'text-olx-muted hover:bg-olx-bg'}`}>
                <Grid size={16} />
              </button>
              <button onClick={() => setViewMode('list')}
                className={`p-1.5 ${viewMode === 'list' ? 'bg-olx-teal text-white' : 'text-olx-muted hover:bg-olx-bg'}`}>
                <List size={16} />
              </button>
            </div>

            <button onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-1 bg-white border border-olx-border rounded px-3 py-1.5 text-sm text-olx-text">
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>
        </div>

        {/* Active attribute filter chips */}
        {activeAttrChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {activeAttrChips.map(({ key, label }) => (
              <span key={key}
                className="flex items-center gap-1 bg-olx-teal/10 text-olx-teal text-xs px-2.5 py-1 rounded-full border border-olx-teal/30">
                {label}
                <button onClick={() => updateAttr(key, '')} className="ml-0.5 hover:text-red-500">
                  <X size={10} />
                </button>
              </span>
            ))}
            <button onClick={clearAttrFilters} className="text-xs text-red-500 hover:underline">
              Clear attribute filters
            </button>
          </div>
        )}

        <div className="flex gap-4">
          {/* Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-56 shrink-0 space-y-4`}>
            {hasFilters && (
              <button onClick={clearAllFilters}
                className="w-full flex items-center justify-center gap-1 text-xs text-red-500 border border-red-200 rounded py-1.5 hover:bg-red-50">
                <X size={12} /> Clear all filters
              </button>
            )}

            {/* Categories */}
            <div className="bg-white border border-olx-border rounded p-4">
              <h3 className="font-bold text-olx-text text-sm mb-3">All Categories</h3>
              <div className="space-y-1">
                <button onClick={() => updateFilter('categorySlug', '')}
                  className={`w-full text-left text-sm py-1 px-2 rounded transition-colors ${!categorySlug ? 'text-olx-teal font-semibold bg-blue-50' : 'text-olx-text hover:bg-olx-bg'}`}>
                  All Categories
                </button>
                {categories.map((c) => (
                  <button key={c.id} onClick={() => {
                    const p = new URLSearchParams(searchParams);
                    if (c.slug) p.set('categorySlug', c.slug); else p.delete('categorySlug');
                    // Clear attribute filters when category changes
                    Array.from(p.keys()).filter((k) => k.startsWith('attr_')).forEach((k) => p.delete(k));
                    p.delete('page');
                    setSearchParams(p);
                  }}
                    className={`w-full text-left text-sm py-1 px-2 rounded transition-colors ${categorySlug === c.slug ? 'text-olx-teal font-semibold bg-blue-50' : 'text-olx-text hover:bg-olx-bg'}`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic category-specific filters */}
            {categorySlug && (
              <DynamicFilterPanel
                categorySlug={categorySlug}
                values={attrValues}
                onChange={updateAttr}
                onClear={clearAttrFilters}
              />
            )}

            {/* Location */}
            <div className="bg-white border border-olx-border rounded p-4">
              <h3 className="font-bold text-olx-text text-sm mb-3">Location</h3>
              <div className="space-y-1">
                {INDIAN_CITIES.map((c) => (
                  <button key={c} onClick={() => updateFilter('city', c === 'All Cities' ? '' : c)}
                    className={`w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                      (city === c || (c === 'All Cities' && !city))
                        ? 'text-olx-teal font-semibold bg-blue-50'
                        : 'text-olx-text hover:bg-olx-bg'
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <PriceRangeFilter
              key={priceKey}
              initialMin={minPrice}
              initialMax={maxPrice}
              onApply={handlePriceApply}
              onCancel={handlePriceCancel}
            />
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 gap-3' : 'space-y-3'}>
                {Array.from({ length: 9 }).map((_, i) =>
                  viewMode === 'grid'
                    ? <SkeletonCard key={i} />
                    : <div key={i} className="bg-white border border-olx-border rounded h-28 animate-pulse" />
                )}
              </div>
            ) : sortedAds.length === 0 ? (
              <div className="text-center py-20 bg-white border border-olx-border rounded-lg">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-olx-text font-semibold text-lg">No results found</p>
                <p className="text-olx-muted text-sm mt-1">Try adjusting your search or filters</p>
                <button onClick={clearAllFilters} className="mt-4 text-olx-teal text-sm font-semibold hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sortedAds.map((ad) => (
                  <AdCard key={ad.id} ad={ad} isFavourited={isFav(ad.id)} onToggleFavourite={handleToggleFav} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {sortedAds.map((ad) => (
                  <div key={ad.id}
                    className="bg-white border border-olx-border rounded overflow-hidden flex gap-3 p-3 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/ads/${ad.id}`)}>
                    <div className="w-32 h-24 shrink-0 rounded overflow-hidden bg-gray-100">
                      {ad.images?.[0] ? (
                        <img
                          src={ad.images[0].startsWith('http') ? ad.images[0] : `http://localhost:3000${ad.images[0]}`}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">📷</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-olx-text text-lg">₹{Number(ad.price).toLocaleString('en-IN')}</p>
                      <p className="text-olx-text text-sm mt-0.5 line-clamp-1">{ad.title}</p>
                      {ad.attributes && Object.keys(ad.attributes).length > 0 && (
                        <p className="text-olx-muted text-xs mt-0.5 line-clamp-1">
                          {Object.entries(ad.attributes)
                            .slice(0, 3)
                            .map(([, v]) => Array.isArray(v) ? v.join(' / ') : v)
                            .join(' · ')}
                        </p>
                      )}
                      <p className="text-olx-muted text-xs mt-1">{[ad.city, ad.state].filter(Boolean).join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-6">
                <button onClick={() => goToPage(page - 1)} disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-olx-border rounded bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-olx-bg transition-colors">
                  <ChevronLeft size={14} /> Prev
                </button>
                {getPageNumbers(page, totalPages).map((p, i) =>
                  p === '...' ? (
                    <span key={`e-${i}`} className="px-2 text-olx-muted text-sm">…</span>
                  ) : (
                    <button key={p} onClick={() => goToPage(p as number)}
                      className={`w-8 h-8 text-sm rounded border transition-colors ${
                        p === page ? 'bg-olx-teal text-white border-olx-teal font-semibold' : 'bg-white border-olx-border text-olx-text hover:bg-olx-bg'
                      }`}>
                      {p}
                    </button>
                  )
                )}
                <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-olx-border rounded bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-olx-bg transition-colors">
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
