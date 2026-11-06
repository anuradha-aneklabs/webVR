import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero/Hero';
import { FacilityCards } from './components/FacilityCards/FacilityCards';
import { FacilityModal } from './components/FacilityCards/FacilityModal';
import { ParkMapGuide } from './components/MapGuide/ParkMapGuide';
import { QRScannerPanel } from './components/QRScanner/QRScannerPanel';
import { QRScannerModal } from './components/QRScanner/QRScannerModal';
import { DirectionsPanel } from './components/Directions/DirectionsPanel';
import { AboutModal } from './components/AboutModal/AboutModal';
import { ExploreMode } from './components/ExploreMode/ExploreMode';
import { RestaurantTourModal } from './components/RestaurantTour/RestaurantTourModal';
import { facilities } from './data/facilities';
import { parkLocations, allParkNodes } from './data/parkLocations';
import { getRoute } from './data/routes';
import type { Facility, RouteData } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [currentLocationId, setCurrentLocationId] = useState<string>('entrance');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('restaurant');
  const [activeRoute, setActiveRoute] = useState<RouteData | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  // Modals & Fullscreen states
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isExploreModeOpen, setIsExploreModeOpen] = useState<boolean>(false);
  const [exploreStartingLoc, setExploreStartingLoc] = useState<string>('entrance');
  const [isRestaurantTourOpen, setIsRestaurantTourOpen] = useState<boolean>(false);

  // Calculate initial route on mount
  useEffect(() => {
    const route = getRoute(currentLocationId, selectedDestinationId);
    setActiveRoute(route);
  }, []);

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

  const handleOpenExploreAt = (locationId: string) => {
    setExploreStartingLoc(locationId);
    setIsExploreModeOpen(true);
  };

  const handleSelectDestination = (destId: string) => {
    setSelectedDestinationId(destId);
    const newRoute = getRoute(currentLocationId, destId);
    setActiveRoute(newRoute);
    setActiveStepIndex(0);
  };

  const handleShowRoute = () => {
    const targetDest = selectedDestinationId || 'restaurant';
    setSelectedDestinationId(targetDest);
    const route = getRoute(currentLocationId, targetDest);
    setActiveRoute(route);
    setIsNavigating(true);
    setActiveStepIndex(0);

    if (window.innerWidth < 768) {
      const mapEl = document.getElementById('map-section');
      mapEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNextStep = () => {
    if (!activeRoute) return;
    if (activeStepIndex < activeRoute.navigationSteps.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((prev) => prev - 1);
    }
  };

  const handleResetRoute = () => {
    setIsNavigating(false);
    setActiveStepIndex(0);
  };

  const handleLocationDetected = (locId: string) => {
    setCurrentLocationId(locId);
    if (selectedDestinationId) {
      const newRoute = getRoute(locId, selectedDestinationId);
      setActiveRoute(newRoute);
      setIsNavigating(true);
      setActiveStepIndex(0);
    }
  };

  const handleNavigateToFacility = (facId: string) => {
    const matchedLoc = parkLocations.find((l) => l.facilityId === facId) || parkLocations.find((l) => l.id === facId);
    if (matchedLoc) {
      handleSelectDestination(matchedLoc.id);
      setIsNavigating(true);
      const mapSection = document.getElementById('map-section');
      mapSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToFacilities = () => {
    const el = document.getElementById('facilities-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToMap = () => {
    const el = document.getElementById('map-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentLocObj = allParkNodes.find((l) => l.id === currentLocationId) || parkLocations[0];

  return (
    <div className="min-h-screen bg-[#0b110e] text-white flex flex-col justify-start py-1 sm:py-1.5 select-none selection:bg-[#28e070] selection:text-black">
      {/* Upper Portion: Hero Section (with Top Navigation Bar floating directly inside) */}
      <Hero
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'explore') {
            handleOpenExploreAt('entrance');
          }
        }}
        onOpenQR={() => setIsQRModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onScrollToFacilities={handleScrollToFacilities}
        onScrollToMap={handleScrollToMap}
        onExploreClick={() => handleOpenExploreAt('entrance')}
        onSelectFacility={handleSelectFacilityById}
        onViewFullMap={handleScrollToMap}
      />

      {/* Middle Portion: 6 Facility Cards Section */}
      <FacilityCards
        onSelectFacility={(fac) => setSelectedFacility(fac)}
        selectedFacilityId={selectedFacility?.id}
      />

      {/* Bottom Portion: Three Panels Section */}
      <section className="w-full max-w-[1400px] mx-auto px-2 sm:px-3 lg:px-4 mb-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-2.5 items-stretch">
          {/* Panel 1: Park Map Guide (approx 42% width -> 5 cols out of 12) */}
          <div className="md:col-span-5 h-full">
            <ParkMapGuide
              selectedDestinationId={selectedDestinationId}
              currentLocationId={currentLocationId}
              activeRoute={activeRoute}
              activeStepIndex={isNavigating ? activeStepIndex : 0}
              onSelectDestination={handleSelectDestination}
            />
          </div>

          {/* Panel 2: Scan for Navigation (approx 24% width -> 3 cols out of 12) */}
          <div className="md:col-span-3 h-full">
            <QRScannerPanel
              onOpenScanner={() => setIsQRModalOpen(true)}
              currentLocationName={currentLocObj.name.split('&')[0]}
            />
          </div>

          {/* Panel 3: Get Directions & Live Turn-by-Turn Guidance (approx 34% width -> 4 cols out of 12) */}
          <div className="md:col-span-4 h-full">
            <DirectionsPanel
              selectedDestinationId={selectedDestinationId}
              currentLocationId={currentLocationId}
              activeRoute={activeRoute}
              activeStepIndex={activeStepIndex}
              isNavigating={isNavigating}
              onSelectDestination={handleSelectDestination}
              onShowRoute={handleShowRoute}
              onNextStep={handleNextStep}
              onPrevStep={handlePrevStep}
              onResetRoute={handleResetRoute}
              onOpenQR={() => setIsQRModalOpen(true)}
            />
          </div>
        </div>
      </section>

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
        selectedDestinationId={selectedDestinationId}
        onStartRouteTo={(destId) => {
          handleSelectDestination(destId);
          setIsNavigating(true);
        }}
      />

      {/* About ParkVerse Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* Full-Screen Park Exploration Mode (Preserved as optional photo tour) */}
      {isExploreModeOpen && (
        <ExploreMode
          initialLocationId={exploreStartingLoc}
          onExit={() => setIsExploreModeOpen(false)}
          onSelectOnParkMap={(locId) => {
            handleSelectDestination(locId);
          }}
        />
      )}

      {/* Dedicated Restaurant 5-Stage Tour Modal */}
      <RestaurantTourModal
        isOpen={isRestaurantTourOpen}
        onClose={() => setIsRestaurantTourOpen(false)}
        onNavigateToParkLocation={(locId) => {
          handleSelectDestination(locId);
        }}
      />
    </div>
  );
};

export default App;
