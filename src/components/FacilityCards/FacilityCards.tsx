import React from 'react';
import { Utensils, Waves, Bed, Trees, Activity, Flower2, ChevronRight } from 'lucide-react';
import { facilities } from '../../data/facilities';
import type { Facility } from '../../types';

interface FacilityCardsProps {
  onSelectFacility: (facility: Facility) => void;
  selectedFacilityId?: string;
}

const iconMap = {
  utensils: Utensils,
  waves: Waves,
  bed: Bed,
  trees: Trees,
  activity: Activity,
  flower2: Flower2,
};

export const FacilityCards: React.FC<FacilityCardsProps> = ({
  onSelectFacility,
  selectedFacilityId
}) => {
  return (
    <section id="facilities-section" className="w-full max-w-[1400px] mx-auto px-2 sm:px-3 mb-1.5 sm:mb-2">
      {/* 6 cards in a compact horizontal row matching reference */}
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
        {facilities.map((fac) => {
          const Icon = iconMap[fac.iconName] || Trees;
          const isSelected = selectedFacilityId === fac.id;

          return (
            <div
              key={fac.id}
              onClick={() => onSelectFacility(fac)}
              className={`relative rounded-xl lg:rounded-2xl overflow-hidden h-[114px] xl:h-[155px] border cursor-pointer group transition-all duration-300 shadow-lg ${
                isSelected
                  ? 'border-[#28e070] shadow-[0_0_15px_rgba(40,224,112,0.35)] scale-[1.02]'
                  : 'border-white/10 hover:border-[#28e070]/50 hover:scale-[1.02]'
              }`}
            >
              {/* Realistic Background Image */}
              <img
                src={fac.image}
                alt={fac.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Dark Gradient Overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />

              {/* Bottom Info Row */}
              <div className="absolute inset-x-0 bottom-0 p-2 flex items-end justify-between gap-1 z-10">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="flex-shrink-0 text-white">
                    <Icon className="w-3.5 h-3.5 text-white drop-shadow" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-[11px] lg:text-[12.5px] text-white leading-tight truncate">
                      {fac.title}
                    </span>
                    <span className="text-[9px] lg:text-[10px] text-gray-300/90 leading-tight truncate font-normal">
                      {fac.subtitle}
                    </span>
                  </div>
                </div>

                {/* Circular Arrow Button */}
                <div className="flex-shrink-0 w-5 h-5 lg:w-5.5 lg:h-5.5 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white/80 group-hover:bg-[#28e070] group-hover:text-black group-hover:border-[#28e070] transition-colors shadow">
                  <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
