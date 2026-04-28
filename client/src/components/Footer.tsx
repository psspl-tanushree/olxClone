import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-olx-border mt-8">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-olx-text text-sm mb-3 uppercase tracking-wide">Popular Locations</h4>
            <ul className="space-y-1.5 text-sm text-olx-muted">
              {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'].map((city) => (
                <li key={city}>
                  <Link to={`/search?city=${city}`} className="hover:text-olx-teal transition-colors">{city}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-olx-text text-sm mb-3 uppercase tracking-wide">Trending Searches</h4>
            <ul className="space-y-1.5 text-sm text-olx-muted">
              {['Cars', 'Motorcycles', 'Mobile Phones', 'Laptops', 'Furniture', 'Jobs', 'Real Estate'].map((cat) => (
                <li key={cat}>
                  <Link to={`/search?search=${cat}`} className="hover:text-olx-teal transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-olx-text text-sm mb-3 uppercase tracking-wide">About Us</h4>
            <ul className="space-y-1.5 text-sm text-olx-muted">
              {['Tech@OLX', 'OLX for Business', 'OLX Blog', 'Sitemap', 'Legal & Privacy information', 'Vulnerability Disclosure'].map((item) => (
                <li key={item}><span className="cursor-pointer hover:text-olx-teal transition-colors">{item}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-olx-text text-sm mb-3 uppercase tracking-wide">Follow Us</h4>
            <div className="flex gap-3 mb-4">
              {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((social) => (
                <button
                  key={social}
                  className="w-8 h-8 rounded-full bg-olx-bg flex items-center justify-center text-xs font-bold text-olx-teal hover:bg-olx-teal hover:text-white transition-colors"
                >
                  {social[0]}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <div className="bg-black text-white text-xs px-3 py-2 rounded flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity w-fit">
                <span className="text-lg">▶</span>
                <div>
                  <div className="text-[10px] opacity-70">GET IT ON</div>
                  <div className="font-bold">Google Play</div>
                </div>
              </div>
              <div className="bg-black text-white text-xs px-3 py-2 rounded flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity w-fit">
                <span className="text-lg"></span>
                <div>
                  <div className="text-[10px] opacity-70">Download on the</div>
                  <div className="font-bold">App Store</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-olx-border mb-4" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-olx-muted">
          <p>© 2024 OLX Clone. All Rights Reserved.</p>
          <div className="flex items-center gap-1">
            <span>Help &amp; Support</span>
            <span className="mx-2">•</span>
            <span>Privacy Policy</span>
            <span className="mx-2">•</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
