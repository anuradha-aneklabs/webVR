import React from 'react';
import { Home, Info } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAbout: () => void;
  onScrollToFacilities?: () => void;
  onOpenQR?: () => void;
  onScrollToMap?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAbout
}) => {
  return (
    <header className="w-full pt-3 pb-1 px-4 lg:px-6 relative z-30 select-none">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand Logo matching reference */}
        <div 
          onClick={() => {
            onSelectTab('explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
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

        {/* Center: Clean Floating Navigation Pills matching reference */}
        <nav className="glass-pill px-1.5 py-1 rounded-full flex items-center gap-1 shadow-xl">
          <button
            onClick={() => {
              onSelectTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
              onSelectTab('about');
              onOpenAbout();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'bg-[#183120] text-[#34f480] border border-[#28e070]/40'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About</span>
          </button>
        </nav>

        {/* Right balance spacer so center nav stays centered */}
        <div className="w-24 hidden md:block flex-shrink-0" />
      </div>
    </header>
  );
};
