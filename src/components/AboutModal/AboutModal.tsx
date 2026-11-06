import React from 'react';
import { X, ShieldCheck, Compass, Sparkles } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-card max-w-lg w-full rounded-3xl overflow-hidden border border-white/15 p-6 shadow-2xl relative flex flex-col gap-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/assets/leaf.svg" alt="ParkVerse" className="w-6 h-6" />
            <h3 className="font-extrabold text-lg text-white">About ParkVerse</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-gray-200 leading-relaxed">
          ParkVerse is a next-generation interactive resort and park exploration interface designed for seamless visitor wayfinding, live navigation, and luxury nature resort discovery.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <Compass className="w-5 h-5 text-[#34f480]" />
            <span className="font-bold text-xs text-white">Interactive Trails</span>
            <span className="text-[11px] text-gray-300">Intelligent wayfinding across cottages, pool, dining, and adventure areas.</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <Sparkles className="w-5 h-5 text-[#34f480]" />
            <span className="font-bold text-xs text-white">Instant QR Check-in</span>
            <span className="text-[11px] text-gray-300">Scan QR codes located at any station for live contextual turn-by-turn routes.</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-gray-400 border-t border-white/10">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#34f480]" />
            Demonstration Prototype
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#28e070] text-black font-bold hover:bg-[#34f480] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
