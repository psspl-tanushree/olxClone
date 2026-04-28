import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

interface Ad {
  id: number;
  title: string;
  price: number;
  images: string[];
  city?: string;
  state?: string;
  createdAt?: string;
  featured?: boolean;
}

interface Props {
  ad: Ad;
  onToggleFavourite?: (id: number) => void;
  isFavourited?: boolean;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function AdCard({ ad, onToggleFavourite, isFavourited }: Props) {
  const imgSrc = ad.images?.[0]
    ? (ad.images[0].startsWith('http') ? ad.images[0] : ad.images[0])
    : null;

  return (
    <Link
      to={`/ads/${ad.id}`}
      className="bg-white border border-olx-border rounded overflow-hidden hover:shadow-md transition-shadow block"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {imgSrc ? (
          <img src={imgSrc} alt={ad.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* Featured badge */}
        {ad.featured && (
          <span className="absolute top-2 left-2 bg-olx-yellow text-olx-teal text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase">
            FEATURED
          </span>
        )}

        {/* Heart button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavourite?.(ad.id); }}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
        >
          <Heart
            size={14}
            fill={isFavourited ? '#ff6b6b' : 'none'}
            stroke={isFavourited ? '#ff6b6b' : '#666'}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-2.5">
        <p className="font-bold text-olx-text text-base leading-tight">
          ₹{Number(ad.price).toLocaleString('en-IN')}
        </p>
        <p className="text-olx-text text-sm mt-0.5 line-clamp-2 leading-snug">
          {ad.title}
        </p>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-olx-muted text-xs truncate">
            {[ad.city, ad.state].filter(Boolean).join(', ')}
          </p>
          <p className="text-olx-muted text-xs whitespace-nowrap ml-1">
            {formatDate(ad.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
