import React from 'react';
import { X, Clock, Check, Navigation, Utensils, Waves, Bed, Trees, Activity, Flower2, Eye } from 'lucide-react';
import type { Facility } from '../../types';

interface FacilityModalProps {
  facility: Facility | null;
  onClose: () => void;
  onNavigateHere: (facilityId: string) => void;
  onExploreLocation?: (facilityId: string) => void;
}

const iconMap = {
  utensils: Utensils,
  waves: Waves,
  bed: Bed,
  trees: Trees,
  activity: Activity,
  flower2: Flower2,
};

export const FacilityModal: React.FC<FacilityModalProps> = ({
  facility,
  onClose,
  onNavigateHere,
  onExploreLocation
}) => {
  if (!facility) return null;

  const Icon = iconMap[facility.iconName] || Trees;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div 
        className="glass-card max-w-lg w-full rounded-3xl overflow-hidden border border-white/15 shadow-2xl relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-44 sm:h-52 w-full">
          <img
            src={facility.image}
            alt={facility.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1712] via-black/35 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Title on Image */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1a3824]/90 border border-[#28e070]/40 flex items-center justify-center text-[#34f480] shadow-lg">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                {facility.title}
              </h3>
              <p className="text-xs text-[#34f480] font-medium">
                {facility.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex flex-col gap-3.5 text-white">
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
            {facility.description}
          </p>

          {/* Operating Hours */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
            <Clock className="w-4 h-4 text-[#28e070]" />
            <span className="text-gray-300">Timings:</span>
            <span className="text-white font-medium">{facility.hours}</span>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Highlights &amp; Amenities
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {facility.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-gray-200">
                  <div className="w-4 h-4 rounded-full bg-[#1b3b27] flex items-center justify-center text-[#34f480] flex-shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: Immersive Tour + Directions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            {onExploreLocation && (
              <button
                onClick={() => {
                  onExploreLocation(facility.id);
                  onClose();
                }}
                className="w-full sm:flex-1 bg-[#28e070] hover:bg-[#34f480] text-black font-extrabold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#28e070]/30 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Enter Immersive Tour</span>
              </button>
            )}

            <button
              onClick={() => {
                onNavigateHere(facility.id);
                onClose();
              }}
              className="w-full sm:flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-[#34f480]" />
              <span>Get Directions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
