import { useState } from 'react';
import { QrCode, Download, Copy } from 'lucide-react';
import { theme } from '../theme';
import { useAxios } from '../hooks/useAxios';
import { showToast } from '../utils/sweetAlert';

export default function GenerateQR() {
  const [text, setText] = useState('');
  const [qrData, setQrData] = useState('');
  const { post } = useAxios();

  const generateQR = async () => {
    if (!text.trim()) {
      showToast('error', 'Please enter text to generate QR code');
      return;
    }
    
    try {
      // You can replace this with actual API call
      // await post('/api/qr/generate', { text });
      
      setQrData(text);
      showToast('success', 'QR Code generated successfully!');
    } catch (error) {
      showToast('error', 'Failed to generate QR code');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    showToast('success', 'Text copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <QrCode size={32} style={{ color: theme.colors.primary.main }} />
        <h1 className="text-3xl font-bold text-gray-900">Generate QR Code</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Text or URL</h2>
          
          <div className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text, URL, or any data to generate QR code..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none resize-none"
            />
            
            <div className="flex gap-3">
              <button
                onClick={generateQR}
                className="flex-1 py-3 text-white rounded-lg font-semibold transition-all hover:shadow-lg"
                style={{ background: theme.gradients.primary }}
              >
                Generate QR Code
              </button>
              
              {text && (
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Copy size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated QR Code</h2>
          
          <div className="flex flex-col items-center space-y-4">
            {qrData ? (
              <>
                <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`}
                    alt="Generated QR Code"
                    className="w-48 h-48"
                  />
                </div>
                
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}`;
                    link.download = 'qrcode.png';
                    link.click();
                    showToast('success', 'QR Code downloaded!');
                  }}
                  className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all hover:shadow-lg"
                  style={{ background: theme.gradients.primary }}
                >
                  <Download size={20} />
                  Download QR Code
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <QrCode size={64} />
                <p className="mt-4 text-center">QR Code will appear here after generation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}