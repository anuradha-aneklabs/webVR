import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, ChevronLeft, ChevronRight, MapPin, Compass, 
  Utensils, Waves, Bed, Trees, Activity, Home, ArrowUp, ArrowLeft, ArrowRight, ArrowDown,
  Volume2, VolumeX, Sparkles, Footprints, ChevronUp, ChevronDown, Navigation, CheckCircle2
} from 'lucide-react';
import { exploreLocations } from '../../data/exploreLocations';
import type { ExploreLocation, Hotspot, WalkWaypoint } from '../../data/exploreLocations';
import { WalkingCharacter } from './WalkingCharacter';

interface ExploreModeProps {
  initialLocationId?: string;
  initialDestinationId?: string;
  onExit: () => void;
  onSelectOnParkMap?: (locationId: string) => void;
  onOpenQR?: () => void;
}

const categoryIcons = {
  welcome: Home,
  dining: Utensils,
  wellness: Waves,
  stay: Bed,
  nature: Trees,
  adventure: Activity,
};

const directionIcons = {
  forward: ArrowUp,
  left: ArrowLeft,
  right: ArrowRight,
  back: ArrowDown,
};

// Verified obstacle-free ground spawn coordinates for each station
const STATION_SPAWN_COORDS: Record<string, { x: number; y: number; scale: number; facing: 'away' | 'left' | 'right' | 'towards' }> = {
  entrance: { x: 50, y: 92, scale: 1.0, facing: 'away' },
  reception: { x: 22, y: 88, scale: 0.95, facing: 'away' },
  restaurant_exterior: { x: 58, y: 95, scale: 1.0, facing: 'away' },
  restaurant_dining: { x: 50, y: 95, scale: 1.0, facing: 'away' },
  pool: { x: 8, y: 84, scale: 0.95, facing: 'away' },
  cottages: { x: 48, y: 94, scale: 1.0, facing: 'away' },
  garden: { x: 24, y: 95, scale: 1.0, facing: 'away' },
  adventure: { x: 12, y: 88, scale: 0.95, facing: 'away' },
  spa: { x: 16, y: 92, scale: 0.95, facing: 'away' }
};

// Station connectivity graph for multi-station route planning
const STATION_ADJACENCY: Record<string, string[]> = {
  entrance: ['reception', 'cottages'],
  reception: ['entrance', 'restaurant_exterior', 'pool'],
  restaurant_exterior: ['reception', 'restaurant_dining', 'pool'],
  restaurant_dining: ['restaurant_exterior', 'pool'],
  pool: ['reception', 'restaurant_exterior', 'cottages', 'spa'],
  cottages: ['entrance', 'pool', 'garden'],
  garden: ['cottages', 'pool', 'adventure'],
  adventure: ['garden', 'spa'],
  spa: ['pool', 'adventure', 'reception']
};

interface ActiveWalkState {
  isActive: boolean;
  targetHotspot: Hotspot | null;
  targetLocationId: string;
  targetSubId?: string;
  currentX: number;
  currentY: number;
  currentScale: number;
  currentFacing: 'away' | 'left' | 'right' | 'towards';
  trailPoints: { x: number; y: number }[];
}

export const ExploreMode: React.FC<ExploreModeProps> = ({
  initialLocationId = 'entrance',
  initialDestinationId = 'restaurant_exterior',
  onExit,
  onSelectOnParkMap
}) => {
  // Guaranteed starting location defaults strictly to Main Entrance
  const [currentLocationId, setCurrentLocationId] = useState<string>(initialLocationId || 'entrance');
  const [currentSubId, setCurrentSubId] = useState<string | null>(null);
  const [showMiniMap, setShowMiniMap] = useState<boolean>(false);
  const [isCrossFading, setIsCrossFading] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Compact right-side destination panel state
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>(initialDestinationId || 'restaurant_exterior');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false);
  const [lastArrivedStation, setLastArrivedStation] = useState<string | null>(null);

  // Initial spawn coordinates for the starting station
  const defaultSpawn = STATION_SPAWN_COORDS[initialLocationId] || STATION_SPAWN_COORDS.entrance;

  // Active walking character & glowing trail state
  const [walkState, setWalkState] = useState<ActiveWalkState>({
    isActive: false,
    targetHotspot: null,
    targetLocationId: '',
    currentX: defaultSpawn.x,
    currentY: defaultSpawn.y,
    currentScale: defaultSpawn.scale,
    currentFacing: defaultSpawn.facing,
    trailPoints: [],
  });

  // Animation frame reference
  const animFrameRef = useRef<number | null>(null);
  const lastFootstepTimeRef = useRef<number>(0);

  // Web Audio Context reference for gentle forest breeze ambiance & footsteps
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback((): AudioContext | null => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  }, []);

  // Synthesize soft organic footsteps on park path (wood/stone/gravel tap)
  const playFootstepSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.value = 520 + Math.random() * 160;
      filter.Q.value = 2.5;

      osc.frequency.setValueAtTime(120 + Math.random() * 25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.045, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio error ignored
    }
  }, [getAudioContext]);

  const toggleAudio = () => {
    if (isAudioPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      setIsAudioPlaying(false);
    } else {
      const ctx = getAudioContext();
      if (!ctx) return;

      try {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 650;

        const gain = ctx.createGain();
        gain.gain.value = 0.08;

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        whiteNoise.start();
        setIsAudioPlaying(true);
      } catch {
        setIsAudioPlaying(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, []);

  // Find current location in the 9-station sequence
  const currentIndex = exploreLocations.findIndex((l) => l.id === currentLocationId);
  const loc: ExploreLocation = exploreLocations[currentIndex >= 0 ? currentIndex : 0];

  // Resolve active sub-location if any
  let activeImage = loc.defaultImage;
  let activeTitle = loc.name;
  let activeDescription = loc.description;
  let activeHotspots: Hotspot[] = loc.hotspots;

  if (loc.subLocations && loc.subLocations.length > 0) {
    const sub = loc.subLocations.find((s) => s.id === currentSubId) || loc.subLocations[0];
    activeImage = sub.image;
    activeTitle = `${loc.name} — ${sub.name}`;
    activeDescription = sub.description;
    activeHotspots = sub.hotspots;
  }

  // Calculate shortest path sequence between current location and selected destination
  const calculateStationRoute = useCallback((startId: string, endId: string): string[] => {
    if (startId === endId) return [startId];
    const queue: string[][] = [[startId]];
    const visited = new Set<string>([startId]);

    while (queue.length > 0) {
      const path = queue.shift()!;
      const curr = path[path.length - 1];

      const neighbors = STATION_ADJACENCY[curr] || [];
      for (const next of neighbors) {
        if (next === endId) {
          return [...path, next];
        }
        if (!visited.has(next)) {
          visited.add(next);
          queue.push([...path, next]);
        }
      }
    }
    return [startId, endId];
  }, []);

  const activeRoute = calculateStationRoute(currentLocationId, selectedDestinationId);
  const nextTargetStationId = activeRoute.length > 1 ? activeRoute[1] : null;

  // Find the hotspot that leads to the next target station
  const nextRouteHotspot = nextTargetStationId 
    ? activeHotspots.find((h) => h.targetLocationId === nextTargetStationId) || activeHotspots[0]
    : null;

  // Fallback safe waypoints if a custom hotspot lacks coordinates
  const getWaypointsForHotspot = (hs: Hotspot): WalkWaypoint[] => {
    if (hs.walkWaypoints && hs.walkWaypoints.length > 0) {
      return hs.walkWaypoints;
    }
    const spawn = STATION_SPAWN_COORDS[currentLocationId] || { x: 50, y: 92, scale: 1.0, facing: 'away' };
    const midX = (spawn.x + hs.x) / 2;
    const midY = (spawn.y + hs.y) / 2;
    return [
      { x: spawn.x, y: spawn.y, scale: spawn.scale, facing: spawn.facing },
      { x: midX, y: midY, scale: (spawn.scale + 0.5) / 2, facing: hs.direction === 'left' ? 'left' : 'away' },
      { x: hs.x, y: hs.y, scale: 0.5, facing: 'away' }
    ];
  };

  // Start continuous walking character & glowing trail along the obstacle-avoiding pathway
  const startWalkingToHotspot = useCallback((hs: Hotspot) => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    setLastArrivedStation(null);

    const waypoints = getWaypointsForHotspot(hs);
    const startPt = waypoints[0];

    // Compute cumulative segment distances for smooth uniform-speed movement
    const segDistances: number[] = [];
    let totalDist = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const p1 = waypoints[i];
      const p2 = waypoints[i + 1];
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      segDistances.push(dist);
      totalDist += dist;
    }

    setWalkState({
      isActive: true,
      targetHotspot: hs,
      targetLocationId: hs.targetLocationId,
      targetSubId: hs.targetSubId,
      currentX: startPt.x,
      currentY: startPt.y,
      currentScale: startPt.scale ?? 1.0,
      currentFacing: startPt.facing ?? 'away',
      trailPoints: [{ x: startPt.x, y: startPt.y }],
    });

    const WALK_DURATION_MS = 2400; // ~2.4 seconds for smooth immersive walk
    const startTime = performance.now();
    lastFootstepTimeRef.current = performance.now();

    const animateWalk = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1.0, elapsed / WALK_DURATION_MS);

      // Play soft footstep sound every 240ms while moving
      if (now - lastFootstepTimeRef.current > 240) {
        lastFootstepTimeRef.current = now;
        playFootstepSound();
      }

      // Map progress (0 to 1) to distance along polyline
      const targetDist = progress * totalDist;
      let accumDist = 0;
      let curSegmentIndex = 0;
      let segProgress = 0;

      for (let i = 0; i < segDistances.length; i++) {
        if (accumDist + segDistances[i] >= targetDist || i === segDistances.length - 1) {
          curSegmentIndex = i;
          const segLen = segDistances[i] || 0.0001;
          segProgress = Math.max(0, Math.min(1, (targetDist - accumDist) / segLen));
          break;
        }
        accumDist += segDistances[i];
      }

      const p1 = waypoints[curSegmentIndex];
      const p2 = waypoints[curSegmentIndex + 1] || p1;

      // Smooth coordinate and scale interpolation
      const currentX = p1.x + (p2.x - p1.x) * segProgress;
      const currentY = p1.y + (p2.y - p1.y) * segProgress;
      const s1 = p1.scale ?? 1.0;
      const s2 = p2.scale ?? 0.5;
      const currentScale = s1 + (s2 - s1) * segProgress;
      const currentFacing = p2.facing || p1.facing || 'away';

      setWalkState((prev) => ({
        ...prev,
        currentX,
        currentY,
        currentScale,
        currentFacing,
        trailPoints: [...prev.trailPoints, { x: currentX, y: currentY }],
      }));

      if (progress < 1.0) {
        animFrameRef.current = requestAnimationFrame(animateWalk);
      } else {
        // Destination threshold reached! Cross-fade to next station
        setIsCrossFading(true);
        setTimeout(() => {
          const nextLocId = hs.targetLocationId;
          setCurrentLocationId(nextLocId);
          setCurrentSubId(hs.targetSubId || null);

          const newSpawn = STATION_SPAWN_COORDS[nextLocId] || { x: 50, y: 92, scale: 1.0, facing: 'away' };

          setTimeout(() => {
            setIsCrossFading(false);
            setWalkState({
              isActive: false,
              targetHotspot: null,
              targetLocationId: '',
              currentX: newSpawn.x,
              currentY: newSpawn.y,
              currentScale: newSpawn.scale,
              currentFacing: newSpawn.facing,
              trailPoints: [],
            });

            setLastArrivedStation(nextLocId);
          }, 200);
        }, 180);
      }
    };

    animFrameRef.current = requestAnimationFrame(animateWalk);
  }, [currentLocationId, playFootstepSound]);

  // Instant location jump (from minimap or bottom bar tabs)
  const handleJumpLocation = (locId: string, subId?: string) => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    const newSpawn = STATION_SPAWN_COORDS[locId] || { x: 50, y: 92, scale: 1.0, facing: 'away' };
    setLastArrivedStation(null);
    setWalkState({
      isActive: false,
      targetHotspot: null,
      targetLocationId: '',
      currentX: newSpawn.x,
      currentY: newSpawn.y,
      currentScale: newSpawn.scale,
      currentFacing: newSpawn.facing,
      trailPoints: [],
    });
    setIsCrossFading(true);
    setTimeout(() => {
      setCurrentLocationId(locId);
      setCurrentSubId(subId || null);
      setTimeout(() => {
        setIsCrossFading(false);
      }, 160);
    }, 200);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % exploreLocations.length;
    handleJumpLocation(exploreLocations[nextIdx].id);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + exploreLocations.length) % exploreLocations.length;
    handleJumpLocation(exploreLocations[prevIdx].id);
  };

  const handleHotspotClick = (hs: Hotspot) => {
    startWalkingToHotspot(hs);
  };

  // Helper to preview destination scene image for tooltips
  const getHotspotPreviewImage = (hs: Hotspot) => {
    if (hs.targetLocationId === loc.id && hs.targetSubId && loc.subLocations) {
      const sub = loc.subLocations.find((s) => s.id === hs.targetSubId);
      if (sub) return sub.image;
    }
    const targetLoc = exploreLocations.find((l) => l.id === hs.targetLocationId);
    if (!targetLoc) return loc.defaultImage;
    if (hs.targetSubId && targetLoc.subLocations) {
      const sub = targetLoc.subLocations.find((s) => s.id === hs.targetSubId);
      if (sub) return sub.image;
    }
    return targetLoc.defaultImage;
  };

  // Convert trail coordinates to SVG path data "M x0 y0 L x1 y1 ..."
  const trailSvgPath = walkState.trailPoints.length > 1
    ? walkState.trailPoints.reduce((acc, pt, idx) => {
        return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
      }, '')
    : '';

  const Icon = categoryIcons[loc.category] || Trees;
  const isAtFinalDestination = currentLocationId === selectedDestinationId;

  return (
    <div className="fixed inset-0 z-50 bg-[#070d0a] text-white flex flex-col justify-between overflow-hidden animate-fadeIn select-none">
      
      {/* 1. Top Header Bar: Clean Spacing & Zero Overlap */}
      <header className="relative z-30 w-full px-4 sm:px-6 py-2.5 bg-[#0a120e]/92 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-3">
        {/* Left: Brand + Location Step Indicator */}
        <div className="flex items-center gap-3 min-w-0">
          <div 
            onClick={onExit}
            className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
            title="Exit to Overview"
          >
            <img src="/assets/leaf.svg" alt="ParkVerse" className="w-6 h-6 drop-shadow group-hover:scale-105 transition-transform" />
            <span className="font-extrabold text-base tracking-tight text-white font-sans hidden sm:inline">
              ParkVerse
            </span>
          </div>

          <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />

          {/* Location Step Badge */}
          <div className="flex items-center gap-2 truncate">
            <span className="px-2.5 py-1 rounded-full bg-[#1b3b27] text-[#34f480] text-xs font-bold border border-[#34f480]/40 flex items-center gap-1.5 flex-shrink-0">
              <Icon className="w-3.5 h-3.5" />
              <span>Step {currentIndex + 1} of {exploreLocations.length}</span>
            </span>
            <span className="text-xs text-gray-300 font-medium truncate hidden md:inline">
              {loc.name}
            </span>
          </div>
        </div>

        {/* Center: Sub-view Switcher Tabs */}
        {loc.subLocations && loc.subLocations.length > 0 && !walkState.isActive && (
          <nav className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/15 overflow-x-auto max-w-[45vw] sm:max-w-none">
            {loc.subLocations.map((sub) => {
              const isSubActive = (currentSubId || loc.subLocations![0].id) === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setCurrentSubId(sub.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isSubActive
                      ? 'bg-[#28e070] text-black shadow-md font-bold'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {sub.tabLabel || sub.name}
                </button>
              );
            })}
          </nav>
        )}

        {/* Walking Status Banner in Header */}
        {walkState.isActive && walkState.targetHotspot && (
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4328]/90 border border-[#34f480] text-[#34f480] text-xs font-bold animate-pulse shadow-[0_0_15px_rgba(52,244,128,0.4)]">
            <Footprints className="w-3.5 h-3.5" />
            <span>Walking to {walkState.targetHotspot.label}...</span>
          </div>
        )}

        {/* Right Controls: Ambient Sound, Mini-Map Toggle & Exit */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={toggleAudio}
            title={isAudioPlaying ? 'Mute Forest Ambiance' : 'Play Gentle Forest Ambiance'}
            className={`px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isAudioPlaying
                ? 'bg-[#1b4328] text-[#34f480] border border-[#34f480]'
                : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 border border-white/15'
            }`}
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#34f480] animate-pulse" />
                <span className="hidden md:inline">Ambience On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                <span className="hidden md:inline">Ambience</span>
              </>
            )}
          </button>



          <button
            onClick={() => setShowMiniMap(!showMiniMap)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showMiniMap
                ? 'bg-[#1e482b] text-[#34f480] border border-[#34f480]'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#34f480]" />
            <span className="hidden sm:inline">Park Map</span>
          </button>

          <button
            onClick={onExit}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow"
          >
            <span>Exit</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Main Photographic Viewport & Grounded Hotspots */}
      <main className="relative flex-1 w-full overflow-hidden bg-black flex items-center justify-center">
        {/* Realistic Photographic Scene with Cross-Fade Transition */}
        <img
          src={activeImage}
          alt={activeTitle}
          className={`w-full h-full object-cover select-none transition-all duration-400 ease-out ${
            isCrossFading ? 'scale-105 opacity-60 blur-[2px]' : 'scale-100 opacity-100 blur-0'
          }`}
        />

        {/* Cinematic Vignette Overlays for Maximum Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070d0a]/90 via-transparent to-black/35 pointer-events-none" />

        {/* 2A. SVG Glowing Neon Trail Line Overlay */}
        {walkState.isActive && walkState.trailPoints.length > 1 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="trail-neon-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="3.0" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Wide Soft Ambient Emerald Aura */}
            <path
              d={trailSvgPath}
              fill="none"
              stroke="#28e070"
              strokeWidth="4.2"
              strokeOpacity="0.45"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#trail-neon-glow)"
            />

            {/* Sharp Neon Green Trail Core */}
            <path
              d={trailSvgPath}
              fill="none"
              stroke="#34f480"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glowing White Core Pulse Accent */}
            <path
              d={trailSvgPath}
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
              strokeDasharray="3 5"
              strokeLinecap="round"
              className="opacity-90"
            />

            {/* Beacon Circle at Start Point */}
            <circle
              cx={walkState.trailPoints[0].x}
              cy={walkState.trailPoints[0].y}
              r="1.8"
              fill="#28e070"
              stroke="#ffffff"
              strokeWidth="0.8"
              className="animate-pulse"
            />

            {/* Target Portal Ring at Destination */}
            {walkState.targetHotspot && (
              <g>
                <circle
                  cx={walkState.targetHotspot.x}
                  cy={walkState.targetHotspot.y}
                  r="3.5"
                  fill="none"
                  stroke="#34f480"
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                  className="animate-spin"
                  style={{ transformOrigin: `${walkState.targetHotspot.x}% ${walkState.targetHotspot.y}%` }}
                />
                <circle
                  cx={walkState.targetHotspot.x}
                  cy={walkState.targetHotspot.y}
                  r="1.5"
                  fill="#34f480"
                />
              </g>
            )}
          </svg>
        )}

        {/* 2B. Walking Character Avatar (Station Spawn Point when idle, moving along path when active) */}
        <WalkingCharacter
          x={walkState.currentX}
          y={walkState.currentY}
          scale={walkState.currentScale}
          facing={walkState.currentFacing}
          isMoving={walkState.isActive}
        />

        {/* 2C. Clickable Directional Hotspot Arrows (Hidden during active walking) */}
        {!walkState.isActive && activeHotspots.map((hs) => {
          const DirIcon = directionIcons[hs.direction || 'forward'];
          const previewImg = getHotspotPreviewImage(hs);

          return (
            <div
              key={hs.id}
              data-hotspot-id={hs.id}
              data-target-loc={hs.targetLocationId}
              data-target-sub={hs.targetSubId || ''}
              data-label={hs.label}
              onClick={() => handleHotspotClick(hs)}
              style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#28e070]/30 pulse-circle absolute" />
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#28e070] text-black flex items-center justify-center shadow-[0_0_20px_#28e070] group-hover:scale-115 transition-transform border-2 border-white">
                  <DirIcon className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              {/* Tooltip on Hover */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-1.5 rounded-xl bg-black/95 backdrop-blur-md border border-white/20 text-white shadow-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:border-[#34f480] min-w-[200px] max-w-[260px] z-30">
                <div className="flex items-center gap-2">
                  <img 
                    src={previewImg} 
                    alt={hs.label} 
                    className="w-12 h-9 object-cover rounded-lg border border-white/20 flex-shrink-0 shadow-md"
                  />
                  <div className="flex flex-col text-left min-w-0 pr-1">
                    <div className="flex items-center gap-1">
                      <DirIcon className="w-2.5 h-2.5 text-[#34f480] flex-shrink-0" />
                      <span className="text-[11px] font-bold text-white group-hover:text-[#34f480] truncate transition-colors">
                        {hs.label}
                      </span>
                    </div>
                    <span className="text-[9px] text-gray-300 font-normal leading-tight line-clamp-1 mt-0.5">
                      {hs.actionText}
                    </span>
                    <span className="text-[9px] text-[#34f480] font-semibold mt-0.5 flex items-center gap-1">
                      <Footprints className="w-2.5 h-2.5" />
                      <span>Click arrow to walk</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* 2D. Compact Right-Side Destination Panel (Does not obstruct path or character) */}
        <div 
          data-testid="destination-panel"
          className={`absolute z-40 transition-all duration-300 ${
            /* Desktop: Upper right corner, max width 270px | Mobile: Compact bottom sheet */
            'top-14 sm:top-16 right-3 sm:right-6 w-[270px] max-w-[85vw] ' +
            'bg-[#0b1610]/95 backdrop-blur-2xl border border-[#34f480]/40 rounded-2xl p-2.5 sm:p-3 shadow-[0_8px_30px_rgba(0,0,0,0.85)]'
          }`}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-5 h-5 rounded-full bg-[#1b3b27] text-[#34f480] flex items-center justify-center flex-shrink-0 border border-[#34f480]/40">
                <Navigation className="w-3 h-3" />
              </span>
              <div className="truncate">
                <span className="text-[11px] font-extrabold text-white block truncate leading-none">
                  {lastArrivedStation ? 'Arrived at Station' : 'Park Navigator'}
                </span>
                <span className="text-[9px] text-[#34f480] font-semibold block truncate mt-0.5">
                  📍 At: {loc.name.split('—')[0].split('&')[0].trim()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title={isPanelCollapsed ? 'Expand Navigation Guide' : 'Collapse Panel'}
            >
              {isPanelCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Panel Expanded Body */}
          {!isPanelCollapsed && (
            <div className="flex flex-col gap-2 pt-2 text-xs">
              {/* Destination Selector Dropdown */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-300 font-semibold flex items-center justify-between">
                  <span>Target Destination:</span>
                  {isAtFinalDestination && (
                    <span className="text-[#34f480] flex items-center gap-0.5 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Reached
                    </span>
                  )}
                </label>
                <select
                  value={selectedDestinationId}
                  onChange={(e) => {
                    setSelectedDestinationId(e.target.value);
                    setLastArrivedStation(null);
                  }}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-2 py-1 text-[11px] text-white focus:outline-none focus:border-[#34f480] cursor-pointer"
                >
                  {exploreLocations.map((dest) => (
                    <option key={dest.id} value={dest.id} className="bg-[#0b120e] text-white">
                      {dest.name.split('—')[0].split('&')[0].trim()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Multi-Station Route Indicator & Next Leg Action */}
              {!isAtFinalDestination && nextRouteHotspot && (
                <div className="p-2 rounded-xl bg-[#132c1c] border border-[#34f480]/50 flex flex-col gap-1.5 shadow-inner">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-300 font-medium">Next Route Leg:</span>
                    <span className="text-[#34f480] font-bold">Step 1 of {Math.max(1, activeRoute.length - 1)}</span>
                  </div>
                  <button
                    disabled={walkState.isActive}
                    onClick={() => startWalkingToHotspot(nextRouteHotspot)}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-[#28e070] hover:bg-[#34f480] text-black font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-[#28e070]/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Footprints className="w-3.5 h-3.5" />
                    <span className="truncate">Walk to {nextRouteHotspot.label.split('&')[0].trim()}</span>
                  </button>
                </div>
              )}

              {/* All Connected Immediate Pathways */}
              <div className="flex flex-col gap-1 pt-1 border-t border-white/10">
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
                  Available Pathways ({activeHotspots.length}):
                </span>
                <div className="flex flex-col gap-1 max-h-[130px] overflow-y-auto pr-0.5">
                  {activeHotspots.map((hs) => {
                    const HsDirIcon = directionIcons[hs.direction || 'forward'];
                    return (
                      <button
                        key={hs.id}
                        disabled={walkState.isActive}
                        onClick={() => startWalkingToHotspot(hs)}
                        className="w-full flex items-center justify-between px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white hover:text-[#34f480] transition-colors border border-white/10 cursor-pointer disabled:opacity-50 text-[11px] group text-left"
                      >
                        <div className="flex items-center gap-1.5 truncate min-w-0 pr-1">
                          <HsDirIcon className="w-3 h-3 text-[#34f480] flex-shrink-0" />
                          <span className="truncate">{hs.label.split('&')[0].trim()}</span>
                        </div>
                        <span className="text-[9.5px] text-[#34f480] font-bold flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
                          Walk →
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Left & Right Chevrons */}
        {!walkState.isActive && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous Location"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/75 hover:bg-[#28e070] hover:text-black border border-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-2xl active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Location"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/75 hover:bg-[#28e070] hover:text-black border border-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-2xl active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </>
        )}

        {/* Floating Mini-Map Overlay */}
        {showMiniMap && (
          <div className="absolute top-4 right-4 sm:right-6 z-40 w-72 sm:w-80 glass-card p-3 rounded-2xl border border-white/20 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#34f480]" />
                <span>Resort Mini-Map</span>
              </span>
              <button
                onClick={() => setShowMiniMap(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative w-full aspect-[16/8] rounded-xl overflow-hidden border border-white/10 bg-black">
              <img
                src="/assets/park_map_clean.jpg"
                alt="Park Map Overview"
                className="w-full h-full object-cover"
              />

              {exploreLocations.map((el) => {
                const isCur = el.id === currentLocationId;
                return (
                  <div
                    key={el.id}
                    onClick={() => handleJumpLocation(el.id)}
                    style={{ left: `${el.mapCoords.x}%`, top: `${el.mapCoords.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform hover:scale-125 ${
                      isCur ? 'scale-125 z-20' : ''
                    }`}
                  >
                    <span
                      className={`block w-2.5 h-2.5 rounded-full border border-white ${
                        isCur
                          ? 'bg-[#34f480] shadow-[0_0_10px_#34f480] ring-2 ring-[#34f480]/50'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-300 mt-2 text-center">
              Currently at <strong className="text-[#34f480]">{loc.name}</strong>. Click any marker to walk there.
            </p>
          </div>
        )}
      </main>

      {/* 3. Bottom Information Panel & 9-Station Trail Timeline */}
      <footer className="relative z-30 px-4 sm:px-6 py-2 bg-[#0a120e]/95 backdrop-blur-xl border-t border-white/10 flex flex-col gap-1.5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded-full bg-[#1b3b27] text-[#34f480] text-[10px] font-bold border border-[#34f480]/40 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{loc.badge}</span>
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                {activeTitle}
              </h2>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-normal line-clamp-1">
              {activeDescription}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {onSelectOnParkMap && (
              <button
                onClick={() => {
                  onSelectOnParkMap(loc.id);
                  onExit();
                }}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#34f480]" />
                <span>Show on Map</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-3.5 py-1.5 rounded-full bg-[#28e070] hover:bg-[#34f480] text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#28e070]/30 cursor-pointer"
            >
              <span>Next Station</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Sequential 9-Station Trail Timeline */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 border-t border-white/5 select-none">
          {exploreLocations.map((el, i) => {
            const isCur = el.id === currentLocationId;
            const ElIcon = categoryIcons[el.category] || Trees;

            return (
              <button
                key={el.id}
                onClick={() => handleJumpLocation(el.id)}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isCur
                    ? 'bg-[#1b4328] text-[#34f480] border border-[#34f480] font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className={`w-3 h-3 rounded-full flex items-center justify-center text-[8.5px] ${
                  isCur ? 'bg-[#34f480] text-black font-extrabold' : 'bg-white/10 text-gray-400'
                }`}>
                  {i + 1}
                </span>
                <ElIcon className="w-2.5 h-2.5" />
                <span>{el.name.split('—')[0].split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
