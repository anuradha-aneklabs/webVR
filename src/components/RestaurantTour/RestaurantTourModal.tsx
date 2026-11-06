import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Compass, Utensils, Navigation } from 'lucide-react';

interface RestaurantTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToParkLocation?: (locationId: string) => void;
  initialStageId?: string;
}

interface Station {
  id: string;
  name: string;
  stageName: string;
  image: string;
  caption: string;
  description: string;
  highlights: string[];
  hotspots: {
    label: string;
    targetStageId: string;
    x: number;
    y: number;
    hint: string;
  }[];
}

const stations: Station[] = [
  {
    id: 'exterior',
    stageName: '1. Exterior Deck',
    name: 'Pavilion Exterior & Arrival Deck',
    image: '/assets/restaurant_exterior.jpg',
    caption: 'Arrival at The Forest Pavilion',
    description: 'Contemporary cedar timber and steel pavilion architecture surrounded by tropical rainforest canopy with warm ground lanterns.',
    highlights: ['Cedar Timber Framing', 'Ground Lantern Lighting', 'Rainforest Canopy', 'Open Arrival Deck'],
    hotspots: [
      {
        label: 'Enter Wine Foyer',
        targetStageId: 'entrance',
        x: 50,
        y: 62,
        hint: 'Step into the host entrance foyer'
      },
      {
        label: 'Walk to Garden Terrace',
        targetStageId: 'outdoor',
        x: 84,
        y: 70,
        hint: 'Visit outdoor seating'
      }
    ]
  },
  {
    id: 'entrance',
    stageName: '2. Foyer Entrance',
    name: 'Host Reception & Wine Foyer',
    image: '/assets/restaurant_entrance.jpg',
    caption: 'Welcome & Sommelier Cellar',
    description: 'Curated wooden greeting stand with an amber lamp, temperature-controlled wine cellar wall, and dark hardwood floors.',
    highlights: ['Sommelier Cellar', 'Concierge Greeting', 'Warm Amber Lighting', 'Polished Hardwood'],
    hotspots: [
      {
        label: 'Step into Grand Dining Hall',
        targetStageId: 'dining',
        x: 52,
        y: 56,
        hint: 'Enter the main dining room'
      },
      {
        label: 'Back to Exterior Deck',
        targetStageId: 'exterior',
        x: 18,
        y: 72,
        hint: 'Return to outside deck'
      }
    ]
  },
  {
    id: 'dining',
    stageName: '3. Main Dining',
    name: 'Grand Dining Hall',
    image: '/assets/restaurant_dining.jpg',
    caption: 'Atmospheric Fine Dining Area',
    description: 'Vaulted dark cedar timber ceilings, hanging glass globe chandeliers, white linen tables, and panoramic garden windows.',
    highlights: ['Vaulted Cedar Roof', 'Chandelier Ambiance', 'Farm-to-Table Menu', 'Illuminated Garden Views'],
    hotspots: [
      {
        label: 'Inspect Open Kitchen',
        targetStageId: 'kitchen',
        x: 76,
        y: 54,
        hint: 'Watch chefs plate artisanal dishes'
      },
      {
        label: 'Step to Outdoor Terrace',
        targetStageId: 'outdoor',
        x: 26,
        y: 60,
        hint: 'Al-fresco garden dining'
      }
    ]
  },
  {
    id: 'kitchen',
    stageName: '4. Open Kitchen',
    name: 'Executive Culinary Kitchen',
    image: '/assets/restaurant_kitchen.jpg',
    caption: 'Artisanal Culinary Station',
    description: 'Open-concept live kitchen where executive chefs craft gourmet dishes along stainless steel counters beneath brass heat lamps.',
    highlights: ['Wood-Fired Hearth', 'Chef Counter Seating', 'Live Plating Station', 'Organic Seasonings'],
    hotspots: [
      {
        label: 'Return to Dining Hall',
        targetStageId: 'dining',
        x: 24,
        y: 65,
        hint: 'Back to your table'
      },
      {
        label: 'Go to Outdoor Terrace',
        targetStageId: 'outdoor',
        x: 80,
        y: 62,
        hint: 'Step outside to terrace'
      }
    ]
  },
  {
    id: 'outdoor',
    stageName: '5. Outdoor Dining',
    name: 'Candlelit Garden Terrace',
    image: '/assets/restaurant_outdoor.jpg',
    caption: 'Candlelit Garden Terrace',
    description: 'Romantic terrace dining beneath lush palm fronds and glowing string fairy lights, overlooking misty forest canopy at dusk.',
    highlights: ['Candlelit Tables', 'Fairy String Lights', 'Tropical Palms', 'Misty Dusk Horizon'],
    hotspots: [
      {
        label: 'Step Back Inside Dining Room',
        targetStageId: 'dining',
        x: 48,
        y: 52,
        hint: 'Return to indoors'
      },
      {
        label: 'Walk to Main Exterior',
        targetStageId: 'exterior',
        x: 18,
        y: 68,
        hint: 'Back to arrival deck'
      }
    ]
  }
];

export const RestaurantTourModal: React.FC<RestaurantTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateToParkLocation,
  initialStageId = 'exterior'
}) => {
  const [currentStageId, setCurrentStageId] = useState<string>(initialStageId);

  if (!isOpen) return null;

  const currentIdx = stations.findIndex((s) => s.id === currentStageId);
  const currentStation = stations[currentIdx] || stations[0];

  const handleNext = () => {
    const nextIdx = (currentIdx + 1) % stations.length;
    setCurrentStageId(stations[nextIdx].id);
  };

  const handlePrev = () => {
    const prevIdx = (currentIdx - 1 + stations.length) % stations.length;
    setCurrentStageId(stations[prevIdx].id);
  };

  const handleJumpToStage = (stageId: string) => {
    setCurrentStageId(stageId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fadeIn p-2 sm:p-4 select-none">
      <div className="relative w-full max-w-6xl h-[94vh] max-h-[850px] bg-[#0b120e] rounded-3xl overflow-hidden border border-white/15 shadow-2xl flex flex-col justify-between text-white">
        
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md z-30 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1b3b27] border border-[#28e070]/40 flex items-center justify-center text-[#34f480] shadow">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  The Forest Pavilion Restaurant Tour
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#163622] text-[#34f480] text-[10px] font-bold border border-[#28e070]/30">
                  5-Stage Walkthrough
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Exterior → Foyer Entrance → Grand Dining Hall → Open Kitchen → Outdoor Terrace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stage Progress Stepper */}
        <div className="px-3 sm:px-6 py-2 bg-[#0d1712] border-b border-white/5 flex items-center justify-between gap-1 overflow-x-auto select-none flex-shrink-0">
          {stations.map((st, idx) => {
            const isActive = st.id === currentStageId;
            return (
              <button
                key={st.id}
                onClick={() => handleJumpToStage(st.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#1e482b] text-[#34f480] border border-[#34f480]/50 shadow-sm font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isActive ? 'bg-[#34f480] text-black font-extrabold' : 'bg-white/10 text-gray-300'
                }`}>
                  {idx + 1}
                </span>
                <span>{st.name.split('—')[0].split('(')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Main Viewport Container */}
        <div className="relative flex-1 w-full overflow-hidden bg-black flex items-center justify-center">
          <div className="relative w-full h-full">
            <img
              src={currentStation.image}
              alt={currentStation.name}
              className="w-full h-full object-cover select-none animate-fadeIn transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

            {/* Clickable Hotspots Overlaid on Photo */}
            {currentStation.hotspots.map((hs, hIdx) => (
              <div
                key={hIdx}
                onClick={() => handleJumpToStage(hs.targetStageId)}
                style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-[#28e070]/30 pulse-circle absolute" />
                  <div className="w-8 h-8 rounded-full bg-[#28e070] text-black flex items-center justify-center shadow-[0_0_18px_#28e070] group-hover:scale-115 transition-transform border-2 border-white">
                    <Navigation className="w-3.5 h-3.5 fill-black stroke-none rotate-45" />
                  </div>
                </div>

                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1.5 px-2.5 py-1 rounded-xl bg-black/90 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow-2xl whitespace-nowrap group-hover:border-[#34f480] group-hover:text-[#34f480] transition-all pointer-events-none">
                  <span>{hs.label}</span>
                  <span className="block text-[9.5px] font-normal text-gray-300">{hs.hint}</span>
                </div>
              </div>
            ))}

            {/* Left/Right Floating Navigation Arrows */}
            <button
              onClick={handlePrev}
              aria-label="Previous Station"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/70 hover:bg-[#28e070] hover:text-black border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xl active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Station"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/70 hover:bg-[#28e070] hover:text-black border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xl active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>

            {/* Station Info Overlay Badge on bottom-left */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-20 glass-card p-3 sm:p-4 rounded-2xl border border-white/15 text-white shadow-2xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-[#1e482b] text-[#34f480] text-[10px] font-bold border border-[#34f480]/40">
                  {currentStation.stageName}
                </span>
                <h4 className="font-extrabold text-sm sm:text-base text-white">
                  {currentStation.name}
                </h4>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed mb-2.5">
                {currentStation.description}
              </p>

              <div className="flex items-center gap-1.5 flex-wrap">
                {currentStation.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-200"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Controls */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#090f0c] border-t border-white/10 flex items-center justify-between text-xs text-gray-300 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Step {currentIdx + 1} of {stations.length}:</span>
            <strong className="text-white">{currentStation.name}</strong>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToParkLocation && (
              <button
                onClick={() => {
                  onNavigateToParkLocation('restaurant');
                  onClose();
                }}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#34f480]" />
                <span>Show on Park Map</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-full bg-[#28e070] hover:bg-[#34f480] text-black font-extrabold text-xs flex items-center gap-1 transition-all shadow cursor-pointer"
            >
              <span>{currentIdx === stations.length - 1 ? 'Start Over' : 'Next Station'}</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
