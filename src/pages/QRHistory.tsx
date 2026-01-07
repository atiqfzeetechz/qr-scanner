// @ts-nocheck
import { useEffect, useState } from 'react';
import { History, QrCode, Download, Eye } from 'lucide-react';
import { theme } from '../theme';
import { useAxios } from '../hooks/useAxios';
import { useQRCodeView } from '../hooks/useQRCodeView';
import { encodeData } from '../helper/encodeDecode';
import { APPURL } from '../utils/config';

export default function QRHistory() {
  const { get } = useAxios()
  const [allQrCodes, setAllQrCodes] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await get('/admin/qr/getAll')
      if (res.success) {
        setAllQrCodes(res.data)
      }
    })()
  }, [])

  const parseQRData = (dataString: string) => {
    try {
      const parsed = JSON.parse(dataString);
      return parsed.data || {};
    } catch {
      return { content: dataString };
    }
  };

  const handleView = (item: any) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <History size={32} style={{ color: theme.colors.primary.main }} />
        <h1 className="text-3xl font-bold text-gray-900">QR Code History</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-4">
          {allQrCodes.length === 0 ? (
            <div className="text-center py-12">
              <History size={64} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No QR code history found</p>
            </div>
          ) : (
            allQrCodes.map((item: any) => {
              const parsedData = parseQRData(item.data);
              return (
                <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${theme.colors.primary.main}20` }}>
                        <QrCode size={24} style={{ color: theme.colors.primary.main }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {parsedData.fullName || 'QR Code'}
                          </h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {item.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {parsedData.visaNumber ? `Visa: ${parsedData.visaNumber}` : ''}
                          {parsedData.nationality ? ` | ${parsedData.nationality}` : ''}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>Downloads: {item.downloadCount}</span>
                          <span>Scans: {item.scanCount}</span>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleView(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View QR Code"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* QR Modal */}
      {selectedItem && showModal && (
        <QRViewModal
          item={selectedItem}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// QR View Modal Component
function QRViewModal({ item, onClose }: { item: any, onClose: () => void }) {
  const { ref, display, download } = useQRCodeView(item.options);

  useEffect(() => {
    if (item.data) {
      const optiondata = {
        _id: item._id,
        tempalateId: item.data.templateId,
        status: item.status,

      }
      const url = encodeData(optiondata)
      const fullurl = `${APPURL}/admin/qrData/${url}`

      display(fullurl);
    }
  }, [item.data, display]);

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50" style={{
      backgroundColor: "rgba(0, 0, 0, 0.5)"
    }}>
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">QR Code Preview</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <div ref={ref} className="border rounded-lg p-4" />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => download('png')}
            className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: theme.gradients.primary }}
          >
            <Download size={16} />
            Download
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}