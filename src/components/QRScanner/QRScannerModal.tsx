import React, { useEffect, useState, useRef } from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, MapPin, QrCode, Navigation, Compass, Upload, ExternalLink, Footprints } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { allQRCodes, graphNodes } from '../../data/navigationGraph';
import { parkLocations } from '../../data/parkLocations';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationDetected: (locationId: string) => void;
  onStartRouteTo?: (destinationId: string) => void;
  selectedDestinationId?: string;
  onOpenExploreAt?: (locationId: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onLocationDetected,
  onStartRouteTo,
  onOpenExploreAt,
  selectedDestinationId = 'restaurant'
}) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const [targetDestination, setTargetDestination] = useState<string>(selectedDestinationId);
  const [hasArrived, setHasArrived] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'stations' | 'junctions'>('stations');

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setDetectedLocation(null);
      setCameraError(null);
      setHasArrived(false);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    setIsScanning(true);
    setDetectedLocation(null);
    setHasArrived(false);

    try {
      const scanner = new Html5Qrcode('qr-reader-target');
      html5QrCodeRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => { }
      );
    } catch (err: any) {
      console.warn('Camera error or permissions denied:', err);
      setCameraError('Camera access unavailable. Use the Station & Junction Checkpoint simulators below:');
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (e) {
        console.warn('Error stopping scanner:', e);
      }
      html5QrCodeRef.current = null;
      setIsScanning(false);
    }
  };

  const handleScanSuccess = (text: string) => {
    const matched = allQRCodes.find(
      (st) =>
        st.id.toLowerCase() === text.toLowerCase() ||
        st.qrCodeId.toLowerCase() === text.toLowerCase() ||
        text.toUpperCase().includes(st.qrCodeId) ||
        text.toLowerCase().includes(st.id)
    );

    const locationId = matched ? matched.id : 'entrance';
    setDetectedLocation(locationId);
    stopCamera();
    onLocationDetected(locationId);

    if (locationId === targetDestination) {
      setHasArrived(true);
    }
  };

  const handleSimulateScan = (locationId: string) => {
    setDetectedLocation(locationId);
    stopCamera();
    onLocationDetected(locationId);

    if (locationId === targetDestination) {
      setHasArrived(true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      let scanner = html5QrCodeRef.current;
      if (!scanner) {
        scanner = new Html5Qrcode('qr-reader-target');
        html5QrCodeRef.current = scanner;
      }
      const decodedText = await scanner.scanFile(file, true);
      handleScanSuccess(decodedText);
    } catch (err: any) {
      console.warn('File decode error:', err);
      setCameraError('Could not optical-decode QR code from image file. Try a clear image or quick checkpoints below.');
    }
  };

  const handleStartNavigation = () => {
    if (onStartRouteTo && targetDestination) {
      onStartRouteTo(targetDestination);
    }
    onClose();
  };

  if (!isOpen) return null;

  const currentStation = detectedLocation ? graphNodes[detectedLocation] : null;
  const destStation = graphNodes[targetDestination] || graphNodes.restaurant;

  const isAtDestination = detectedLocation === targetDestination || hasArrived;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="glass-card max-w-lg w-full rounded-3xl overflow-hidden border border-white/15 p-4 sm:p-5 shadow-2xl relative flex flex-col gap-3 text-white max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1b3b27] flex items-center justify-center text-[#34f480] shadow">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">Scan Park QR Code</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#1b3b27] text-[9.5px] font-bold text-[#34f480] border border-[#34f480]/30">
                  Indoor/Outdoor Localization
                </span>
              </div>
              <p className="text-[11px] text-gray-300">
                Scan signs or junction markers to update your live location
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scanner Viewport or Success State */}
        {!detectedLocation ? (
          <div className="relative w-full aspect-[4/3] max-h-52 rounded-2xl overflow-hidden bg-black/90 border border-white/10 flex items-center justify-center">
            <div id="qr-reader-target" className="w-full h-full" />

            {/* Scanning Laser Sight */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-40 h-40 border-2 border-[#34f480] rounded-2xl relative shadow-[0_0_20px_rgba(52,244,128,0.4)]">
                  <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-4 border-l-4 border-[#34f480]" />
                  <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-4 border-r-4 border-[#34f480]" />
                  <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-4 border-l-4 border-[#34f480]" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-4 border-r-4 border-[#34f480]" />
                  <div className="w-full h-0.5 bg-[#34f480] shadow-[0_0_8px_#34f480] animate-pulse absolute top-1/2" />
                </div>
              </div>
            )}

            {/* Camera error message */}
            {cameraError && (
              <div className="p-3 text-center flex flex-col items-center gap-1.5 text-xs text-gray-300">
                <AlertCircle className="w-7 h-7 text-amber-400" />
                <p className="max-w-xs">{cameraError}</p>
              </div>
            )}
          </div>
        ) : (
          /* Scanned Success & Route Planner Screen */
          <div className="p-3.5 rounded-2xl bg-[#0f2719] border border-[#34f480]/50 flex flex-col gap-2.5 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-[#34f480] flex-shrink-0" />
              <div>
                <span className="text-[10px] text-[#34f480] font-mono uppercase tracking-wider block">
                  QR Verified: {currentStation?.qrCodeId}
                </span>
                <h4 className="font-extrabold text-sm sm:text-base text-white">
                  Current Location: {currentStation?.name}
                </h4>
              </div>
            </div>

            {/* If user scanned their destination: Arrival Screen */}
            {isAtDestination ? (
              <div className="p-2.5 rounded-xl bg-[#1b4328] text-center text-xs font-bold text-[#34f480] border border-[#34f480]/40">
                🎉 Destination Reached! Welcome to {destStation.name}!
              </div>
            ) : (
              /* If user scanned starting location or junction: Route Planner */
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-gray-300 font-semibold flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-[#34f480]" />
                    <span>Select Destination to Calculate Route:</span>
                  </label>
                  <select
                    value={targetDestination}
                    onChange={(e) => setTargetDestination(e.target.value)}
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#34f480]"
                  >
                    {parkLocations.filter((s) => s.id !== detectedLocation).map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#0b120e] text-white">
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleStartNavigation}
                  className="w-full bg-[#28e070] hover:bg-[#34f480] text-black font-extrabold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#28e070]/30 transition-all cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Calculate Real Route &amp; Start Navigation</span>
                </button>

                {onOpenExploreAt && (
                  <button
                    onClick={() => {
                      if (detectedLocation) {
                        onOpenExploreAt(detectedLocation);
                        onClose();
                      }
                    }}
                    className="w-full bg-[#163622] hover:bg-[#28e070] text-[#34f480] hover:text-black font-extrabold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-[#34f480]/50 shadow transition-all cursor-pointer"
                  >
                    <Footprints className="w-3.5 h-3.5" />
                    <span>Walk Here in Explore Mode</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Station & Junction QR Checkpoint Simulator Pills */}
        <div className="flex flex-col gap-1.5 pt-1 border-t border-white/10">
          <div className="flex items-center justify-between">
            {/* Tabs: Stations vs Junctions */}
            <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10">
              <button
                onClick={() => setActiveTab('stations')}
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${activeTab === 'stations' ? 'bg-[#28e070] text-black' : 'text-gray-400 hover:text-white'
                  }`}
              >
                Park Stations ({allQRCodes.filter((q) => !q.isJunction).length})
              </button>
              <button
                onClick={() => setActiveTab('junctions')}
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${activeTab === 'junctions' ? 'bg-[#28e070] text-black' : 'text-gray-400 hover:text-white'
                  }`}
              >
                Junction Checkpoints ({allQRCodes.filter((q) => q.isJunction).length})
              </button>
            </div>

            <span className="text-[9.5px] text-gray-500">Tap to test scan</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 max-h-36 overflow-y-auto">
            {allQRCodes
              .filter((st) => (activeTab === 'junctions' ? st.isJunction : !st.isJunction))
              .map((st) => (
                <button
                  key={st.id}
                  onClick={() => handleSimulateScan(st.id)}
                  className={`p-1.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between cursor-pointer ${detectedLocation === st.id
                      ? 'bg-[#1b4328] border-[#34f480] text-[#34f480]'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200'
                    }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[8.5px] font-mono text-gray-400">{st.qrCodeId}</span>
                    <MapPin className="w-2.5 h-2.5 text-[#34f480]" />
                  </div>
                  <span className="font-bold text-[10px] truncate leading-tight">{st.shortName || st.name}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Alternative Real Input: Upload QR Image File or Physical QR Gallery */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-[11px] cursor-pointer transition-colors shadow-sm">
            <Upload className="w-3.5 h-3.5 text-[#34f480]" />
            <span>Upload Real QR File</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          <a
            href="/assets/qr/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-gray-300 hover:text-[#34f480] transition-colors"
          >
            <span>Physical Sign Gallery</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {cameraError && !detectedLocation && (
            <button
              onClick={startCamera}
              className="flex items-center gap-1 text-[11px] text-[#34f480] hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Camera</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
