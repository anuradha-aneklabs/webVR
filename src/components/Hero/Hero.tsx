import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Navbar } from '../Navbar/Navbar';

interface HeroProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAbout: () => void;
  onScrollToFacilities: () => void;
  onExploreClick: () => void;
  onOpenQR?: () => void;
  onScrollToMap?: () => void;
  onSelectFacility?: (facilityId: string) => void;
  onViewFullMap?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  activeTab,
  onSelectTab,
  onOpenAbout,
  onScrollToFacilities,
  onExploreClick
}) => {
  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-2 sm:px-3 mb-1.5 sm:mb-2">
      <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[264px] xl:h-[370px] flex flex-col justify-between">
        {/* Background Twilight Resort Aerial Photo */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/assets/hero_clean.jpg"
            alt="The Forest Park & Resort twilight aerial view"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle multi-layer gradient overlay for readability while keeping the pool & clubhouse bright */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#060c09]/95 via-[#08120c]/60 to-transparent w-full md:w-[62%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08100c]/80 via-transparent to-black/25" />
        </div>

        {/* Top Navbar Floating directly over the hero image */}
        <Navbar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          onOpenAbout={onOpenAbout}
          onScrollToFacilities={onScrollToFacilities}
        />

        {/* Hero Main Content Row */}
        <div className="relative z-10 w-full px-3 sm:px-5 lg:px-6 pb-2.5 sm:pb-3 flex-1 flex items-center justify-between gap-3">
          {/* Left Hero Text matching reference */}
          <div className="max-w-md flex flex-col items-start text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#122b1c]/80 border border-[#28e070]/40 text-[#34f480] text-[9.5px] sm:text-[10px] lg:text-[11px] font-semibold mb-1.5 tracking-wide backdrop-blur-md shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-[#34f480]" />
              <span>Premium Nature Resort</span>
            </div>

            {/* Main Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-[1.08] mb-1 font-sans drop-shadow-md">
              Explore Our Park
            </h1>

            {/* Subheading */}
            <h2 className="text-xs sm:text-sm lg:text-lg xl:text-xl font-bold tracking-tight mb-1.5 drop-shadow flex items-center gap-1.5 flex-wrap">
              <span className="text-white">Discover</span>
              <span className="text-[#28e070] font-black">•</span>
              <span className="text-[#28e070] font-black">Relax</span>
              <span className="text-[#28e070] font-black">•</span>
              <span className="text-white">Enjoy</span>
            </h2>

            {/* Description */}
            <p className="text-[9.5px] sm:text-[10.5px] lg:text-xs text-gray-200/90 leading-relaxed font-normal max-w-xs sm:max-w-sm mb-2.5 drop-shadow">
              A perfect blend of nature, luxury and relaxation at The Forest Park &amp; Resort.
            </p>

            {/* CTA Button */}
            <button
              onClick={onExploreClick}
              className="group bg-[#28e070] hover:bg-[#34f480] active:scale-95 text-black font-extrabold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs inline-flex items-center gap-1.5 shadow-[0_4px_16px_rgba(40,224,112,0.4)] transition-all cursor-pointer transform hover:translate-y-[-1px]"
            >
              <span>Explore Park</span>
              <ArrowRight className="w-3.5 h-3.5 text-black group-hover:translate-x-1 transition-transform stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
