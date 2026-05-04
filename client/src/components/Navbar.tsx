import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Plus, Heart, MessageSquare, User, LogOut, ChevronRight, X, ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';

const INDIAN_CITIES = [
  'India', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow',
  'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
  'Pimpri', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra',
  'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar',
];

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState('India');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  const cityRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Keep Navbar city in sync with URL params (sidebar filter updates URL directly)
  useEffect(() => {
    const urlCity = searchParams.get('city');
    setSelectedCity(urlCity && INDIAN_CITIES.includes(urlCity) ? urlCity : 'India');
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setShowCityDropdown(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCity !== 'India') params.set('city', selectedCity);
    // Preserve active category filter when searching within a category
    const categorySlug = searchParams.get('categorySlug');
    if (categorySlug) params.set('categorySlug', categorySlug);
    navigate(`/search?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    navigate(`/search?${params.toString()}`);
  };

  const filteredCities = INDIAN_CITIES.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <header className="bg-olx-teal sticky top-0 z-50 shadow-md">
      <div className="max-w-[1200px] mx-auto px-4 h-[60px] flex items-center gap-3">
        {/* Logo */}
        <Link to="/" className="shrink-0 mr-1">
          <div className="flex items-center">
            <span className="text-white font-black text-2xl tracking-tighter">
              OL<span className="text-olx-yellow">X</span>
            </span>
          </div>
        </Link>

        {/* Location Picker */}
        <div className="relative shrink-0" ref={cityRef}>
          <button
            onClick={() => setShowCityDropdown(!showCityDropdown)}
            className="flex items-center gap-1 text-white text-sm hover:text-olx-yellow transition-colors whitespace-nowrap"
          >
            <MapPin size={14} className="text-olx-yellow" />
            <span className="max-w-[100px] truncate">{selectedCity}</span>
            <ChevronDown size={14} />
          </button>

          {showCityDropdown && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-xl border border-olx-border z-50">
              <div className="p-2 border-b border-olx-border">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search city..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-olx-border rounded focus:outline-none focus:border-olx-teal"
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setShowCityDropdown(false);
                      setCitySearch('');
                      const params = new URLSearchParams();
                      if (searchQuery) params.set('search', searchQuery);
                      if (city !== 'India') params.set('city', city);
                      const categorySlug = searchParams.get('categorySlug');
                      if (categorySlug) params.set('categorySlug', categorySlug);
                      navigate(`/search?${params.toString()}`);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-olx-bg transition-colors ${selectedCity === city ? 'text-olx-teal font-semibold' : 'text-olx-text'}`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 flex max-w-[600px]">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find Cars, Mobile Phones and more..."
              className="w-full px-4 py-2 pr-8 text-sm text-olx-text focus:outline-none rounded-l-sm border-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-olx-yellow px-4 py-2 hover:bg-olx-yellow-hover transition-colors rounded-r-sm"
          >
            <Search size={18} className="text-olx-teal" />
          </button>
        </form>

        {/* Right Nav */}
        <nav className="flex items-center gap-1 shrink-0 ml-auto">
          {user ? (
            <>
              <Link
                to="/favourites"
                className="flex items-center gap-1 px-2 py-1 text-white text-sm hover:text-olx-yellow transition-colors"
              >
                <Heart size={16} />
                <span className="hidden lg:inline">Saved</span>
              </Link>

              <Link
                to="/messages"
                className="flex items-center gap-1 px-2 py-1 text-white text-sm hover:text-olx-yellow transition-colors"
              >
                <MessageSquare size={16} />
                <span className="hidden lg:inline">Chat</span>
              </Link>

              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1.5 px-2 py-1 text-white text-sm hover:text-olx-yellow transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-olx-yellow flex items-center justify-center text-olx-teal font-bold text-sm">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden lg:inline max-w-[80px] truncate">{user.name}</span>
                  <ChevronDown size={14} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-xl border border-olx-border z-50 py-1">
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50"
                      >
                        <ShieldCheck size={15} /> Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-olx-text hover:bg-olx-bg"
                    >
                      <User size={15} /> My Profile
                    </Link>
                    <Link
                      to="/my-ads"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-olx-text hover:bg-olx-bg"
                    >
                      <ChevronRight size={15} /> My Ads
                    </Link>
                    <Link
                      to="/favourites"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-olx-text hover:bg-olx-bg"
                    >
                      <Heart size={15} /> Saved Ads
                    </Link>
                    <hr className="my-1 border-olx-border" />
                    <button
                      onClick={() => { dispatch(logout()); navigate('/'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 px-3 py-1 text-white text-sm border border-white rounded hover:text-olx-yellow hover:border-olx-yellow transition-colors"
            >
              <User size={15} />
              Login / Register
            </Link>
          )}

          <Link
            to="/post-ad"
            className="ml-2 flex items-center gap-1.5 bg-olx-yellow text-olx-teal font-bold px-4 py-1.5 rounded-sm text-sm hover:bg-olx-yellow-hover transition-colors"
          >
            <Plus size={16} strokeWidth={3} />
            SELL
          </Link>
        </nav>
      </div>
    </header>
  );
}
