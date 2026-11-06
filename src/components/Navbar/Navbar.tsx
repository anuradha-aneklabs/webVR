import React from 'react';
import { Home, LayoutGrid, MapPin, Info, QrCode } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenQR: () => void;
  onOpenAbout: () => void;
  onScrollToFacilities: () => void;
  onScrollToMap: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenQR,
  onOpenAbout,
  onScrollToFacilities,
  onScrollToMap
}) => {
  return (
    <header className="w-full pt-2.5 pb-1 px-4 lg:px-6 relative z-30 select-none">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Brand Logo matching reference */}
        <div 
          onClick={() => {
            onSelectTab('explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <img 
            src="/assets/leaf.svg" 
            alt="ParkVerse Leaf" 
            className="w-6 h-6 lg:w-7 lg:h-7 drop-shadow-[0_2px_8px_rgba(40,224,112,0.5)] group-hover:scale-105 transition-transform" 
          />
          <span className="font-extrabold text-base lg:text-lg tracking-tight text-white font-sans drop-shadow-sm">
            ParkVerse
          </span>
        </div>

        {/* Center: Floating Navigation Pills matching reference */}
        <nav className="glass-pill px-1 py-1 rounded-full flex items-center gap-0.5 shadow-xl">
          <button
            onClick={() => {
              onSelectTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              activeTab === 'explore'
                ? 'bg-[#183120] text-[#34f480] border border-[#28e070]/40 shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Explore Park</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('facilities');
              onScrollToFacilities();
            }}
            className={`hidden xs:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
              activeTab === 'facilities'
                ? 'bg-[#183120] text-[#34f480] border border-[#28e070]/40'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Facilities</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('map');
              onScrollToMap();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
              activeTab === 'map'
                ? 'bg-[#183120] text-[#34f480] border border-[#28e070]/40'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Map Guide</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('about');
              onOpenAbout();
            }}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
              activeTab === 'about'
                ? 'bg-[#183120] text-[#34f480] border border-[#28e070]/40'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About</span>
          </button>
        </nav>

        {/* Right: Scan QR button matching reference */}
        <button
          onClick={onOpenQR}
          className="glass-pill px-3 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-semibold text-white hover:bg-[#1a2c20] hover:border-[#28e070]/40 transition-all cursor-pointer shadow-lg active:scale-95"
        >
          <QrCode className="w-3.5 h-3.5 text-[#34f480]" />
          <span>Scan QR</span>
        </button>
      </div>
    </header>
  );
};
