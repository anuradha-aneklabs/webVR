import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero/Hero';
import { FacilityCards } from './components/FacilityCards/FacilityCards';
import { FacilityModal } from './components/FacilityCards/FacilityModal';
import { ParkMapGuide } from './components/MapGuide/ParkMapGuide';
import { QRScannerModal } from './components/QRScanner/QRScannerModal';
import { AboutModal } from './components/AboutModal/AboutModal';
import { ExploreMode } from './components/ExploreMode/ExploreMode';
import { RestaurantTourModal } from './components/RestaurantTour/RestaurantTourModal';
import { facilities } from './data/facilities';
import { getRoute } from './data/routes';
import type { Facility, RouteData } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [currentLocationId, setCurrentLocationId] = useState<string>('entrance');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('restaurant');
  const [activeRoute, setActiveRoute] = useState<RouteData | null>(null);

  // Modals & Fullscreen states
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isExploreModeOpen, setIsExploreModeOpen] = useState<boolean>(false);
  const [exploreStartingLoc, setExploreStartingLoc] = useState<string>('entrance');
  const [exploreTargetDest, setExploreTargetDest] = useState<string>('restaurant_exterior');
  const [isRestaurantTourOpen, setIsRestaurantTourOpen] = useState<boolean>(false);

  // Calculate route for Park Map Guide on mount and change
  useEffect(() => {
    const route = getRoute(currentLocationId, selectedDestinationId);
    setActiveRoute(route);
  }, [currentLocationId, selectedDestinationId]);

  // Handlers
  const handleSelectFacilityById = (facId: string) => {
    if (facId === 'restaurant') {
      setIsRestaurantTourOpen(true);
      return;
    }
    const found = facilities.find((f) => f.id === facId);
    if (found) {
      setSelectedFacility(found);
    }
  };

  const handleSelectDestination = (destId: string) => {
    setSelectedDestinationId(destId);
    const newRoute = getRoute(currentLocationId, destId);
    setActiveRoute(newRoute);
  };

  const handleOpenExploreAt = (locationId: string, destId?: string) => {
    setExploreStartingLoc(locationId || 'entrance');
    if (destId) {
      const targetStation = destId === 'restaurant' ? 'restaurant_exterior' : destId;
      setExploreTargetDest(targetStation);
    }
    setIsExploreModeOpen(true);
  };

  const handleNavigateToFacility = (facId: string) => {
    const targetStation = facId === 'restaurant' ? 'restaurant_exterior' : facId;
    setExploreTargetDest(targetStation);
    setExploreStartingLoc(currentLocationId || 'entrance');
    setIsExploreModeOpen(true);
  };

  const handleLocationDetected = (locId: string) => {
    setCurrentLocationId(locId);
    setExploreStartingLoc(locId);
  };

  const handleScrollToFacilities = () => {
    const el = document.getElementById('facilities-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b110e] text-white flex flex-col justify-start py-1 sm:py-1.5 select-none selection:bg-[#28e070] selection:text-black">
      <div className="w-full flex flex-col">
        {/* Upper Portion: Hero Section (with Top Navigation Bar floating inside) */}
        <Hero
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'explore') {
              handleOpenExploreAt('entrance');
            }
          }}
          onOpenAbout={() => setIsAboutModalOpen(true)}
          onScrollToFacilities={handleScrollToFacilities}
          onExploreClick={() => handleOpenExploreAt('entrance')}
        />

        {/* Middle Portion: 6 Facility Cards Section */}
        <FacilityCards
          onSelectFacility={(fac) => handleSelectFacilityById(fac.id)}
          selectedFacilityId={selectedFacility?.id}
        />

        {/* Lower Portion: Compact Park Map Guide in Original 5-Column Placement */}
        <section className="w-full max-w-[1400px] mx-auto px-2 sm:px-3 mb-1.5 sm:mb-2">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-2.5 items-stretch">
            {/* Panel 1: Original Compact Park Map Guide (approx 42% width -> 5 cols out of 12) */}
            <div className="md:col-span-5 h-full">
              <ParkMapGuide
                selectedDestinationId={selectedDestinationId}
                currentLocationId={currentLocationId}
                activeRoute={activeRoute}
                activeStepIndex={0}
                onSelectDestination={handleSelectDestination}
                onExploreRoute={(destId) => {
                  handleOpenExploreAt('entrance', destId);
                }}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Luxury Footer */}
      <footer className="w-full max-w-[1400px] mx-auto px-4 py-2 mt-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 border-t border-white/5">
        <div className="flex items-center gap-2">
          <img src="/assets/leaf.svg" alt="ParkVerse" className="w-4 h-4 opacity-70" />
          <span className="font-semibold text-gray-300">ParkVerse</span>
          <span>•</span>
          <span>The Forest Park &amp; Resort Exploration &amp; Navigation System</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Protected Nature Sanctuary</span>
          <span>•</span>
          <span>QR Guidance &amp; Live Walking Trails</span>
          <span>•</span>
          <span>© 2026 ParkVerse</span>
        </div>
      </footer>

      {/* Interactive Facility Details Modal */}
      <FacilityModal
        facility={selectedFacility}
        onClose={() => setSelectedFacility(null)}
        onNavigateHere={handleNavigateToFacility}
        onExploreLocation={(facId) => {
          if (facId === 'restaurant') {
            setIsRestaurantTourOpen(true);
          } else {
            handleOpenExploreAt(facId);
          }
        }}
      />

      {/* Interactive QR Scanner Modal */}
      <QRScannerModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onLocationDetected={handleLocationDetected}
        onOpenExploreAt={(locId) => handleOpenExploreAt(locId)}
        selectedDestinationId={exploreTargetDest}
        onStartRouteTo={(destId) => {
          setExploreTargetDest(destId);
          setIsExploreModeOpen(true);
        }}
      />

      {/* About ParkVerse Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* Full-Screen Park Exploration Mode with Continuous Walking Character & Glowing Trail */}
      {isExploreModeOpen && (
        <ExploreMode
          initialLocationId={exploreStartingLoc}
          initialDestinationId={exploreTargetDest}
          onExit={() => setIsExploreModeOpen(false)}
          onOpenQR={() => setIsQRModalOpen(true)}
        />
      )}

      {/* Dedicated Restaurant 5-Stage Tour Modal */}
      <RestaurantTourModal
        isOpen={isRestaurantTourOpen}
        onClose={() => setIsRestaurantTourOpen(false)}
        onNavigateToParkLocation={(locId) => {
          handleOpenExploreAt('restaurant_exterior', locId);
        }}
      />
    </div>
  );
};

export default App;
