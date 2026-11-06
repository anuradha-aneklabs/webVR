import React from 'react';
import { QrCode, Scan } from 'lucide-react';

interface QRScannerPanelProps {
  onOpenScanner: () => void;
  currentLocationName: string;
}

export const QRScannerPanel: React.FC<QRScannerPanelProps> = ({
  onOpenScanner,
  currentLocationName
}) => {
  return (
    <div className="glass-panel rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between h-[164px] xl:h-[240px] shadow-2xl relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <QrCode className="w-3.5 h-3.5 text-[#34f480]" />
          <h3 className="font-bold text-xs lg:text-[13px] text-white tracking-tight">
            Scan for Navigation
          </h3>
        </div>
      </div>

      {/* Realistic Photo of QR Signboard Stand */}
      <div
        onClick={onOpenScanner}
        className="relative w-full flex-1 rounded-xl overflow-hidden bg-[#0c1610] border border-white/10 group cursor-pointer shadow-inner mb-1.5"
      >
        <img
          src="/assets/qr_stand.jpg"
          alt="Scan this QR for directions - ParkVerse outdoor easel stand"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 backdrop-blur-[2px]">
          <div className="w-7 h-7 rounded-full bg-[#28e070] text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Scan className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-white bg-black/70 px-2 py-0.5 rounded-full border border-white/20">
            Click to Scan
          </span>
        </div>

        {/* Bottom current location indicator */}
        <div className="absolute bottom-1 inset-x-1.5 z-10 flex items-center justify-between pointer-events-none">
          <span className="text-[8.5px] lg:text-[9.5px] bg-black/85 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-white/10 text-gray-200">
            Current: <strong className="text-[#34f480]">{currentLocationName}</strong>
          </span>
        </div>
      </div>

      {/* Subtext description matching reference */}
      <p className="text-[9.5px] lg:text-[10.5px] text-gray-300/90 leading-tight">
        Scan QR at any location to get instant directions.
      </p>
    </div>
  );
};
