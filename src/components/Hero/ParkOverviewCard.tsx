import React from 'react';
import { MapPin, Utensils, Waves, Bed, Trees, Activity, Flower2, ArrowRight } from 'lucide-react';

interface ParkOverviewCardProps {
  onSelectFacility: (facilityId: string) => void;
  onViewFullMap: () => void;
}

export const ParkOverviewCard: React.FC<ParkOverviewCardProps> = ({
  onSelectFacility,
  onViewFullMap
}) => {
  const items = [
    { id: 'restaurant', name: 'Restaurant', icon: Utensils },
    { id: 'pool', name: 'Swimming Pool', icon: Waves },
    { id: 'cottages', name: 'Cottages & Rooms', icon: Bed },
    { id: 'garden', name: 'Garden', icon: Trees },
    { id: 'adventure', name: 'Adventure Zone', icon: Activity },
    { id: 'spa', name: 'Spa & Wellness', icon: Flower2 }
  ];

  return (
    <div className="glass-card w-[130px] xl:w-[185px] rounded-2xl p-2 xl:p-2.5 shadow-2xl flex flex-col justify-between border border-white/15 text-white z-20 h-[200px] xl:h-[280px]">
      {/* Header */}
      <div className="flex items-center gap-1 px-0.5">
        <MapPin className="w-3 h-3 text-[#34f480]" />
        <span className="font-bold text-[10px] sm:text-[11px] lg:text-[12px] tracking-tight text-white">
          Park Overview
        </span>
      </div>

      {/* Thumbnail of entrance */}
      <div className="w-full h-10 sm:h-11 lg:h-16 xl:h-20 rounded-lg overflow-hidden relative shadow-inner border border-white/10 flex-shrink-0">
        <img
          src="/assets/overview_thumb.jpg"
          alt="Resort Entrance Overview"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Facility List */}
      <div className="flex flex-col gap-0">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelectFacility(item.id)}
              className="w-full flex items-center gap-1.5 px-1 py-0.5 rounded text-[9px] sm:text-[9.5px] lg:text-[11px] text-gray-200 hover:text-white hover:bg-white/10 transition-colors text-left group"
            >
              <Icon className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-gray-300 group-hover:text-[#34f480] transition-colors flex-shrink-0" />
              <span className="font-medium group-hover:translate-x-0.5 transition-transform truncate">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* View Full Map button */}
      <button
        onClick={onViewFullMap}
        className="w-full pt-1 border-t border-white/10 flex items-center justify-end gap-1 text-[9px] sm:text-[9.5px] lg:text-[11px] font-semibold text-[#28e070] hover:text-[#34f480] transition-colors cursor-pointer group"
      >
        <span>View Full Map</span>
        <ArrowRight className="w-2.5 h-2.5 lg:w-3 lg:h-3 group-hover:translate-x-0.5 transition-transform stroke-[2]" />
      </button>
    </div>
  );
};
