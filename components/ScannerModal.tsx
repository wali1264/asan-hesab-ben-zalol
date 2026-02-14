
import React, { useRef, useEffect, useState } from 'react';
import { X, Camera, RefreshCw, Zap } from 'lucide-react';

interface ScannerModalProps {
  onClose: () => void;
  onScan: (data: string) => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({ onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Could not access camera. Please ensure permissions are granted.");
      }
    }

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      onScan(`SKU-${Math.floor(Math.random() * 900000 + 100000)}`);
      setIsScanning(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera size={18} className="text-blue-400" />
            <span className="font-bold">Inventory Scanner</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="aspect-square bg-black relative flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              <Zap size={48} className="mx-auto mb-4 opacity-20" />
              {error}
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover opacity-60"
              />
              {/* Scanning Overlay */}
              <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                <div className="w-full h-full border-2 border-blue-500/50 rounded-lg relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] ${isScanning ? 'animate-bounce' : 'animate-[scan_2s_infinite]'}`}></div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 bg-white space-y-4">
          <p className="text-center text-xs text-slate-500">
            Align the barcode or QR code within the frame to scan automatically.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onClose}
              className="py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={simulateScan}
              disabled={isScanning}
              className="py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              {isScanning ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
              {isScanning ? 'Processing...' : 'Capture'}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
};

export default ScannerModal;
