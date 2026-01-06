// @ts-nocheck
import { useState, useRef } from 'react';
import { Scan, Camera, Upload } from 'lucide-react';
import { theme } from '../theme';
import { showToast } from '../utils/sweetAlert';

export default function ScanQR() {
  const [scannedData] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startScanning = () => {
    setIsScanning(true);
    showToast('info', 'Camera scanning feature will be implemented with a QR scanner library');
    // TODO: Implement camera scanning with react-qr-scanner or similar library
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement QR code reading from uploaded image
      showToast('info', 'File upload QR scanning will be implemented');
    }
  };

  const copyResult = () => {
    if (scannedData) {
      navigator.clipboard.writeText(scannedData);
      showToast('success', 'Scanned data copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Scan size={32} style={{ color: theme.colors.primary.main }} />
        <h1 className="text-3xl font-bold text-gray-900">Scan QR Code</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Scanner</h2>
          
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              {isScanning ? (
                <div className="text-center">
                  <Camera size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Camera scanning active...</p>
                  <p className="text-sm text-gray-500 mt-2">Point camera at QR code</p>
                </div>
              ) : (
                <div className="text-center">
                  <Scan size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Click start to begin scanning</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              {!isScanning ? (
                <button
                  onClick={startScanning}
                  className="flex-1 py-3 text-white rounded-lg font-semibold transition-all hover:shadow-lg"
                  style={{ background: theme.gradients.primary }}
                >
                  Start Camera Scan
                </button>
              ) : (
                <button
                  onClick={stopScanning}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold transition-all hover:bg-red-600"
                >
                  Stop Scanning
                </button>
              )}
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Upload QR image"
              >
                <Upload size={20} />
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Scanned Result</h2>
          
          <div className="space-y-4">
            {scannedData ? (
              <>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-gray-600 mb-2">Scanned Data:</p>
                  <p className="text-gray-900 break-all">{scannedData}</p>
                </div>
                
                <button
                  onClick={copyResult}
                  className="w-full py-3 text-white rounded-lg font-semibold transition-all hover:shadow-lg"
                  style={{ background: theme.gradients.primary }}
                >
                  Copy Result
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Scan size={64} />
                <p className="mt-4 text-center">Scanned data will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}