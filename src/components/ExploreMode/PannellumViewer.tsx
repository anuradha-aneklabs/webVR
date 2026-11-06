import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    pannellum?: any;
  }
}

interface Hotspot360 {
  pitch: number;
  yaw: number;
  type?: 'info' | 'scene';
  text: string;
  clickHandlerArgs?: any;
  clickHandlerFunc?: (args: any) => void;
}

interface PannellumViewerProps {
  imagePath: string;
  title?: string;
  author?: string;
  hotspots?: Hotspot360[];
  onHotspotClick?: (targetId: string, subId?: string) => void;
}

export const PannellumViewer: React.FC<PannellumViewerProps> = ({
  imagePath,
  title = '360° Panoramic View',
  author = 'ParkVerse Resort Experience',
  hotspots = [],
  onHotspotClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerId = 'pannellum-active-viewer';
    containerRef.current.id = containerId;

    const initViewer = () => {
      if (typeof window !== 'undefined' && window.pannellum) {
        if (viewerRef.current) {
          try {
            viewerRef.current.destroy();
          } catch (e) {
            console.warn('Destroying previous viewer:', e);
          }
          viewerRef.current = null;
        }

        const pannellumHotspots = hotspots.map((h) => ({
          pitch: h.pitch,
          yaw: h.yaw,
          type: h.type || 'info',
          text: h.text,
          clickHandlerFunc: () => {
            if (onHotspotClick && h.clickHandlerArgs) {
              onHotspotClick(h.clickHandlerArgs.targetId, h.clickHandlerArgs.subId);
            }
          }
        }));

        try {
          viewerRef.current = window.pannellum.viewer(containerId, {
            type: 'equirectangular',
            panorama: imagePath,
            autoLoad: true,
            autoRotate: -1.2,
            compass: true,
            showZoomCtrl: true,
            showFullscreenCtrl: false,
            mouseZoom: true,
            title,
            author,
            hfov: 100,
            minHfov: 50,
            maxHfov: 120,
            hotSpots: pannellumHotspots
          });
        } catch (err) {
          console.error('Error initializing Pannellum:', err);
        }
      }
    };

    // If script is already loaded, init immediately; otherwise retry briefly
    if (window.pannellum) {
      initViewer();
    } else {
      const timer = setTimeout(initViewer, 300);
      return () => clearTimeout(timer);
    }

    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          console.warn('Viewer destroy cleanup:', e);
        }
        viewerRef.current = null;
      }
    };
  }, [imagePath, hotspots]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black shadow-2xl">
      <div ref={containerRef} className="w-full h-full min-h-[360px]" />
      
      {/* 360 Indicator Badge */}
      <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-md border border-[#34f480]/50 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#34f480] animate-ping" />
        <span className="text-[#34f480]">Interactive 360° Panoramic Viewer</span>
        <span className="text-gray-400 font-normal">| Drag to look around</span>
      </div>
    </div>
  );
};

