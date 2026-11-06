import React, { useState } from 'react';
import { 
  Navigation, MapPin, ChevronDown, Check, RotateCcw, 
  ArrowUp, ArrowRight, ArrowLeft, ArrowUpRight, ArrowUpLeft,
  CheckCircle2, CornerUpRight, CornerUpLeft, QrCode, Compass, ChevronRight, ChevronLeft
} from 'lucide-react';
import { parkLocations, allParkNodes } from '../../data/parkLocations';
import type { RouteData, TurnType } from '../../types';

interface DirectionsPanelProps {
  selectedDestinationId: string;
  currentLocationId: string;
  activeRoute: RouteData | null;
  activeStepIndex: number;
  isNavigating: boolean;
  onSelectDestination: (destId: string) => void;
  onShowRoute: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onResetRoute: () => void;
  onOpenQR: () => void;
}

const turnIconMap: Record<TurnType, React.ElementType> = {
  depart: Compass,
  straight: ArrowUp,
  slight_right: ArrowUpRight,
  turn_right: ArrowRight,
  sharp_right: CornerUpRight,
  slight_left: ArrowUpLeft,
  turn_left: ArrowLeft,
  sharp_left: CornerUpLeft,
  uturn: RotateCcw,
  arrive: CheckCircle2,
};

export const DirectionsPanel: React.FC<DirectionsPanelProps> = ({
  selectedDestinationId,
  currentLocationId,
  activeRoute,
  activeStepIndex,
  isNavigating,
  onSelectDestination,
  onShowRoute,
  onNextStep,
  onPrevStep,
  onResetRoute,
  onOpenQR
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedLoc = allParkNodes.find((l) => l.id === selectedDestinationId) || parkLocations[0];
  const currentLoc = allParkNodes.find((l) => l.id === currentLocationId) || parkLocations[0];

  const currentStep = activeRoute?.navigationSteps?.[activeStepIndex];
  const isArrivalStep = currentStep?.turnType === 'arrive' || activeStepIndex >= (activeRoute?.navigationSteps.length || 1) - 1;

  const TurnIcon = currentStep ? turnIconMap[currentStep.turnType] || ArrowUp : Navigation;

  return (
    <div className="glass-panel rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between h-[164px] xl:h-[240px] shadow-2xl relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Navigation className={`w-3.5 h-3.5 text-[#34f480] fill-current ${isNavigating ? 'animate-pulse' : ''}`} />
          <h3 className="font-bold text-xs lg:text-[13px] text-white tracking-tight flex items-center gap-1.5">
            <span>{isNavigating ? 'Live Turn-by-Turn Guidance' : 'Get Directions'}</span>
            {isNavigating && (
              <span className="w-2 h-2 rounded-full bg-[#34f480] animate-ping" />
            )}
          </h3>
        </div>

        {activeRoute && (
          <button
            onClick={onResetRoute}
            className="text-[9px] lg:text-[10px] text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            title="Reset Navigation"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Main Body: Left controls/steps + Right visual guidance photo */}
      <div className="grid grid-cols-12 gap-2 items-stretch flex-1 min-h-0">
        
        {/* LEFT COLUMN: Controls or Active Step Turn Guidance (approx 6 cols) */}
        <div className="col-span-6 lg:col-span-6 flex flex-col justify-between gap-1 min-h-0">
          {!isNavigating ? (
            /* Mode 1: Route Setup & Destination Selection */
            <div className="flex flex-col justify-between h-full gap-1">
              <div>
                <div className="flex items-center justify-between text-[9px] lg:text-[10px] text-gray-300 mb-1">
                  <span>Current: <strong className="text-[#34f480]">{currentLoc.name.split('&')[0]}</strong></span>
                  <button 
                    onClick={onOpenQR}
                    className="text-[#34f480] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <QrCode className="w-2.5 h-2.5" />
                    <span>Scan QR</span>
                  </button>
                </div>

                {/* Destination Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full bg-white/95 text-black hover:bg-white rounded-xl px-2 py-1 lg:py-1.5 text-[10.5px] lg:text-[11.5px] font-semibold flex items-center justify-between shadow-md transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin className="w-3 h-3 text-black flex-shrink-0" />
                      <span className="truncate">
                        {selectedLoc ? selectedLoc.name : 'Choose Destination'}
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-black flex-shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#0f1913] border border-white/20 rounded-xl overflow-hidden shadow-2xl z-40 max-h-40 overflow-y-auto">
                      {parkLocations
                        .filter((l) => l.id !== currentLocationId)
                        .map((loc) => (
                          <button
                            key={loc.id}
                            onClick={() => {
                              onSelectDestination(loc.id);
                              setDropdownOpen(false);
                            }}
                            className={`w-full px-2.5 py-1 text-left text-[10.5px] flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer ${
                              selectedDestinationId === loc.id
                                ? 'text-[#34f480] font-bold bg-[#173221]'
                                : 'text-gray-200'
                            }`}
                          >
                            <span className="flex items-center gap-1.5 truncate">
                              <span
                                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                  loc.color === 'red'
                                    ? 'bg-red-400'
                                    : loc.color === 'blue'
                                    ? 'bg-sky-400'
                                    : 'bg-emerald-400'
                                }`}
                              />
                              <span className="truncate">{loc.name}</span>
                            </span>
                            {selectedDestinationId === loc.id && (
                              <Check className="w-3 h-3 text-[#34f480] flex-shrink-0" />
                            )}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Start Turn-by-Turn Navigation Button */}
              <button
                onClick={onShowRoute}
                className="w-full bg-[#28e070] hover:bg-[#34f480] active:scale-95 text-black font-extrabold py-1.5 lg:py-2 px-3 rounded-full text-[10.5px] lg:text-xs flex items-center justify-center gap-1.5 shadow-[0_3px_12px_rgba(40,224,112,0.35)] transition-all cursor-pointer"
              >
                <span>Show Route &amp; Start</span>
                <Navigation className="w-3 h-3 fill-black rotate-45" />
              </button>
            </div>
          ) : (
            /* Mode 2: Live Turn-by-Turn Guidance Screen */
            <div className="flex flex-col justify-between h-full gap-1">
              {currentStep && (
                <div className="flex flex-col gap-1 min-h-0">
                  {/* Step Badge & Turn Icon */}
                  <div className="flex items-center justify-between gap-1">
                    <span className="px-2 py-0.5 rounded-full bg-[#1b3b27] text-[#34f480] text-[9px] font-bold border border-[#34f480]/40 flex items-center gap-1">
                      <TurnIcon className="w-2.5 h-2.5" />
                      <span>Step {activeStepIndex + 1} of {activeRoute?.navigationSteps.length}</span>
                    </span>
                    <span className="text-[9px] text-[#34f480] font-bold">
                      {currentStep.distanceMeters > 0 ? `In ${currentStep.distanceText}` : 'Arrived'}
                    </span>
                  </div>

                  {/* Turn Instruction Text */}
                  <p className="text-[10px] lg:text-[11.5px] text-white font-extrabold leading-tight line-clamp-2">
                    {currentStep.instruction}
                  </p>

                  {/* Landmark Cue */}
                  <p className="text-[8.5px] lg:text-[9.5px] text-gray-300 font-normal truncate">
                    📍 {currentStep.landmarkHint}
                  </p>
                </div>
              )}

              {/* Stepper Controls: Prev / Next / Junction QR Checkpoint */}
              <div className="flex items-center gap-1 pt-1 border-t border-white/10">
                <button
                  onClick={onPrevStep}
                  disabled={activeStepIndex === 0}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onNextStep}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1 transition-all shadow cursor-pointer ${
                    isArrivalStep
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-black animate-pulse'
                      : 'bg-[#28e070] hover:bg-[#34f480] text-black'
                  }`}
                >
                  <span>{isArrivalStep ? '🎉 Destination Reached' : 'Next Step'}</span>
                  {!isArrivalStep && <ChevronRight className="w-3 h-3" />}
                </button>

                <button
                  onClick={onOpenQR}
                  title="Scan QR at Next Junction"
                  className="p-1 rounded-lg bg-[#1b3b27] hover:bg-[#255236] border border-[#34f480]/50 text-[#34f480] transition-colors cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Visual Direction Guidance Image (approx 6 cols) */}
        <div className="col-span-6 lg:col-span-6 relative rounded-xl overflow-hidden h-full border border-white/10 shadow-inner group">
          <img
            src={isNavigating && currentStep?.visualImage ? currentStep.visualImage : '/assets/pathway.jpg'}
            alt="Resort illuminated walking pathway"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

          {/* Dynamic Top Badge */}
          {isNavigating && currentStep && (
            <div className="absolute top-1 left-1 z-10 bg-black/85 backdrop-blur-md border border-white/20 px-1.5 py-0.5 rounded-full text-[8px] lg:text-[9px] font-bold text-white flex items-center gap-1 shadow">
              <TurnIcon className="w-2.5 h-2.5 text-[#34f480]" />
              <span className="capitalize">{currentStep.turnType.replace('_', ' ')}</span>
            </div>
          )}

          {/* Live Navigation Status Badge */}
          <div className="absolute bottom-1 right-1 z-10 bg-black/85 backdrop-blur-md border border-white/15 px-1.5 py-0.5 rounded-full text-[8px] lg:text-[9px] font-medium text-white flex items-center gap-1 shadow-md">
            <span className={`w-1.5 h-1.5 rounded-full ${isNavigating ? 'bg-[#34f480] animate-ping' : 'bg-emerald-400'}`} />
            <span>{isNavigating ? 'Live Visual Guidance' : 'Ready to Navigate'}</span>
          </div>

          {/* Current Target Location Watermark */}
          {isNavigating && (
            <div className="absolute bottom-1 left-1 z-10 text-[8px] text-gray-300 font-mono truncate max-w-[50%]">
              → {selectedLoc.shortName || selectedLoc.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
