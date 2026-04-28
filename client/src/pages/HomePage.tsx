import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { fetchAllAdsHandler } from '../store/slices/adsSlice';
import AdCard from '../components/AdCard';

const CATEGORIES = [
  { name: 'Cars', slug: 'cars', icon: '🚗' },
  { name: 'Motorcycles', slug: 'motorcycles', icon: '🏍️' },
  { name: 'Mobiles', slug: 'mobile-phones', icon: '📱' },
  { name: 'Electronics', slug: 'electronics', icon: '💻' },
  { name: 'Furniture', slug: 'furniture', icon: '🛋️' },
  { name: 'Fashion', slug: 'fashion', icon: '👗' },
  { name: 'Pets', slug: 'pets', icon: '🐾' },
  { name: 'Real Estate', slug: 'real-estate', icon: '🏠' },
  { name: 'Jobs', slug: 'jobs', icon: '💼' },
  { name: 'Services', slug: 'services', icon: '🔧' },
  { name: 'Sports', slug: 'sports', icon: '⚽' },
  { name: 'Books', slug: 'books', icon: '📚' },
];

const HERO_BANNERS = [
  { bg: '#667eea', text: 'Find Your Dream Car', sub: 'Thousands of verified listings', emoji: '🚗' },
  { bg: '#f093fb', text: 'Latest Smartphones', sub: 'Best deals on mobiles & tablets', emoji: '📱' },
  { bg: '#4facfe', text: 'Home & Furniture', sub: 'Furnish your home affordably', emoji: '🏠' },
];

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

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { ads, loading } = useSelector((state: RootState) => state.ads);
  const navigate = useNavigate();
  const catScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchAllAdsHandler({ limit: 24 }));
  }, [dispatch]);

  const scrollCats = (dir: 'left' | 'right') => {
    if (catScrollRef.current) {
      catScrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  // Split ads into sections for OLX-style layout
  const freshAds = ads.slice(0, 16);
  const carAds = ads.filter((a) => a.category?.slug === 'cars').slice(0, 4);
  const mobileAds = ads.filter((a) => a.category?.slug === 'mobile-phones').slice(0, 4);

  return (
    <div className="bg-olx-bg min-h-screen">
      {/* Hero Banner */}
      <div className="bg-olx-teal overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HERO_BANNERS.map((banner, i) => (
              <div
                key={i}
                className="rounded-lg p-5 flex items-center justify-between cursor-pointer hover:opacity-95 transition-opacity"
                style={{ background: banner.bg }}
                onClick={() => navigate(`/search?search=${banner.text.split(' ').slice(-1)[0]}`)}
              >
                <div className="text-white">
                  <p className="font-bold text-lg leading-tight">{banner.text}</p>
                  <p className="text-sm opacity-80 mt-1">{banner.sub}</p>
                </div>
                <span className="text-5xl">{banner.emoji}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="bg-white border-b border-olx-border">
        <div className="max-w-[1200px] mx-auto px-4 py-4 relative">
          <button
            onClick={() => scrollCats('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-1 hover:shadow-md transition-shadow"
          >
            <ChevronLeft size={18} className="text-olx-text" />
          </button>

          <div
            ref={catScrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide px-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => navigate(`/search?categorySlug=${c.slug}`)}
                className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-olx-bg transition-colors shrink-0 min-w-[70px] group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{c.icon}</span>
                <span className="text-xs text-olx-text font-medium whitespace-nowrap">{c.name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollCats('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-1 hover:shadow-md transition-shadow"
          >
            <ChevronRight size={18} className="text-olx-text" />
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-8">
        {/* Cars section */}
        {(carAds.length > 0 || loading) && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-olx-text">Cars</h2>
              <button
                onClick={() => navigate('/search?categorySlug=cars')}
                className="text-sm text-olx-teal font-semibold hover:underline flex items-center gap-1"
              >
                View more <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                : carAds.map((ad) => <AdCard key={ad.id} ad={ad} />)}
            </div>
          </section>
        )}

        {/* Mobiles section */}
        {(mobileAds.length > 0 || loading) && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-olx-text">Mobiles</h2>
              <button
                onClick={() => navigate('/search?categorySlug=mobile-phones')}
                className="text-sm text-olx-teal font-semibold hover:underline flex items-center gap-1"
              >
                View more <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                : mobileAds.map((ad) => <AdCard key={ad.id} ad={ad} />)}
            </div>
          </section>
        )}

        {/* Fresh Recommendations */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-olx-text">Fresh Recommendations</h2>
            <button
              onClick={() => navigate('/search')}
              className="text-sm text-olx-teal font-semibold hover:underline flex items-center gap-1"
            >
              View all <ChevronRight size={16} />
            </button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : freshAds.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-olx-border">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-olx-muted">No ads yet. Be the first to post!</p>
              <button
                onClick={() => navigate('/post-ad')}
                className="mt-4 bg-olx-yellow text-olx-teal font-bold px-6 py-2 rounded text-sm hover:bg-olx-yellow-hover"
              >
                Post an Ad
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {freshAds.map((ad) => <AdCard key={ad.id} ad={ad} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
