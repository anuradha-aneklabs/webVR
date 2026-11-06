import React, { useState } from 'react';
import { MapPin, Plus, Minus, Navigation, Compass } from 'lucide-react';
import { parkLocations, allParkNodes } from '../../data/parkLocations';
import type { RouteData } from '../../types';

interface ParkMapGuideProps {
  selectedDestinationId: string;
  currentLocationId: string;
  activeRoute: RouteData | null;
  activeStepIndex?: number;
  onSelectDestination: (destId: string) => void;
}

export const ParkMapGuide: React.FC<ParkMapGuideProps> = ({
  selectedDestinationId,
  currentLocationId,
  activeRoute,
  activeStepIndex = 0,
  onSelectDestination
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 1));
  };

  const polylinePoints = activeRoute?.points
    ? activeRoute.points.map(([x, y]) => `${x},${y}`).join(' ')
    : '';

  // Get active step position to render live walking beacon
  const currentStep = activeRoute?.navigationSteps?.[activeStepIndex];
  const activeStepPos = currentStep?.pathPoints?.[0] || null;

  return (
    <div id="map-section" className="glass-panel rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between h-[164px] xl:h-[240px] shadow-2xl relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#34f480]" />
          <h3 className="font-bold text-xs lg:text-[13px] text-white tracking-tight">
            Park Map Guide
          </h3>
        </div>
        {activeRoute && (
          <div className="text-[9.5px] lg:text-[10px] text-[#34f480] bg-[#122e1b] px-2 py-0.5 rounded-full border border-[#28e070]/30 font-semibold flex items-center gap-1">
            <Navigation className="w-2.5 h-2.5" />
            <span>{activeRoute.distance} • {activeRoute.duration}</span>
          </div>
        )}
      </div>

      {/* Map Interactive Canvas */}
      <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-[#0c1610] border border-white/10 group select-none">
        {/* Zoomable Container */}
        <div
          className="relative w-full h-full transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Base Aerial Map Image */}
          <img
            src="/assets/park_map_clean.jpg"
            alt="Park Aerial Map Layout"
            className="w-full h-full object-cover pointer-events-none"
          />

          {/* SVG Walkable Route Layer */}
          {activeRoute && activeRoute.points.length > 0 && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="glow-route" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {/* Outer path track */}
              <polyline
                points={polylinePoints}
                stroke="#128a42"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.65"
              />
              {/* Animated active walking line */}
              <polyline
                points={polylinePoints}
                stroke="#34f480"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="animate-dash"
                filter="url(#glow-route)"
              />
            </svg>
          )}

          {/* Live Step Navigation Marker (Beacon showing user's current step along the path) */}
          {activeStepPos && (
            <div
              style={{ left: `${activeStepPos[0]}%`, top: `${activeStepPos[1]}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none transition-all duration-500 ease-out"
            >
              <div className="w-8 h-8 rounded-full bg-[#34f480]/35 pulse-circle absolute" />
              <div className="w-4 h-4 rounded-full bg-[#34f480] text-black flex items-center justify-center shadow-[0_0_15px_#34f480] border-2 border-white">
                <Compass className="w-2.5 h-2.5 stroke-[3] animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>
          )}

          {/* Subtle Junction Checkpoints along Walkways */}
          {allParkNodes.filter((n) => n.isJunction).map((jct) => {
            const isTraversed = activeRoute?.nodeIds?.includes(jct.id);
            const isCurrent = currentLocationId === jct.id;

            return (
              <div
                key={jct.id}
                onClick={() => {
                  onSelectDestination(jct.id);
                  setShowTooltip(false);
                }}
                style={{
                  left: `${jct.x}%`,
                  top: `${jct.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                title={`${jct.name} (${jct.qrCodeId})`}
                className={`absolute z-15 cursor-pointer transition-transform duration-200 hover:scale-130 ${
                  isTraversed ? 'scale-110' : 'opacity-70'
                }`}
              >
                <span
                  className={`block w-1.5 h-1.5 rounded-full border border-black/70 ${
                    isCurrent
                      ? 'bg-amber-400 ring-2 ring-amber-400 shadow-[0_0_8px_#fbbf24]'
                      : isTraversed
                      ? 'bg-[#34f480] shadow-[0_0_6px_#34f480]'
                      : 'bg-white/80'
                  }`}
                />
              </div>
            );
          })}

          {/* Primary Destination Location Pins */}
          {parkLocations.map((loc) => {
            const isDestination = selectedDestinationId === loc.id;
            const isCurrent = currentLocationId === loc.id;

            return (
              <div
                key={loc.id}
                onClick={() => {
                  onSelectDestination(loc.id);
                  setShowTooltip(false);
                }}
                style={{
                  left: `${loc.x}%`,
                  top: `${loc.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-20 cursor-pointer transition-all duration-200 hover:scale-110 ${
                  isDestination ? 'scale-110 z-30' : ''
                }`}
              >
                {loc.id === 'entrance' ? (
                  /* Main Entrance with Red Pin */
                  <div className="flex items-center gap-1">
                    <div className="relative">
                      {isCurrent && (
                        <div className="absolute inset-0 rounded-full bg-red-500 pulse-circle pointer-events-none" />
                      )}
                      <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 border border-white/80 shadow-lg flex items-center justify-center text-white">
                        <MapPin className="w-2.5 h-2.5 lg:w-3 lg:h-3 fill-white stroke-none" />
                      </div>
                    </div>
                    <div className="bg-black/85 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-white/20 text-[8.5px] lg:text-[9.5px] font-bold text-white shadow-md whitespace-nowrap">
                      {loc.name}
                    </div>
                  </div>
                ) : (
                  /* Standard Pill Markers */
                  <div
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] lg:text-[9.5px] font-bold shadow-lg backdrop-blur-md border transition-all whitespace-nowrap ${
                      isDestination
                        ? 'bg-[#1e482b] border-[#34f480] text-[#34f480] shadow-[0_0_12px_rgba(52,244,128,0.5)]'
                        : isCurrent
                        ? 'bg-[#291e12] border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                        : loc.color === 'blue'
                        ? 'bg-black/80 border-[#38bdf8]/40 text-white hover:border-[#38bdf8]'
                        : 'bg-black/80 border-[#22c55e]/40 text-white hover:border-[#22c55e]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isDestination
                          ? 'bg-[#34f480] animate-ping'
                          : isCurrent
                          ? 'bg-amber-400 ring-2 ring-amber-400'
                          : loc.color === 'blue'
                          ? 'bg-[#38bdf8]'
                          : 'bg-[#22c55e]'
                      }`}
                    />
                    <span>{loc.name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Curved Pointer Tooltip: "Click any location to get directions" */}
        {showTooltip && (
          <div className="absolute top-1.5 right-2 z-30 pointer-events-none flex flex-col items-end">
            <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-lg px-2 py-0.5 text-center shadow-2xl">
              <span className="text-[9px] lg:text-[10px] text-white font-medium block leading-tight">
                Click any location
              </span>
              <span className="text-[8.5px] lg:text-[9px] text-gray-300 font-normal block leading-tight">
                to calculate real route
              </span>
            </div>
            <svg
              className="w-8 h-6 lg:w-10 lg:h-7 text-white/80 mt-[-2px] mr-3"
              viewBox="0 0 50 40"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M38 2 C32 18, 18 24, 8 32"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeDasharray="2 2"
              />
              <path
                d="M5 25 L8 33 L16 31"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* Zoom Controls (+ / -) */}
        <div className="absolute bottom-1.5 right-1.5 z-30 flex flex-col rounded bg-black/80 backdrop-blur-md border border-white/20 overflow-hidden shadow-lg">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors border-b border-white/10"
          >
            <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
          </button>
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
