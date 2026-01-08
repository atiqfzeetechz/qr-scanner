// @ts-nocheck
import { useEffect, useState } from 'react';
import { History, QrCode, Download, Eye, ToggleLeft, ToggleRight, Scan } from 'lucide-react';
import { theme } from '../theme';
import { useAxios } from '../hooks/useAxios';
import { QRModal } from '../components/QRModal';
import { encodeData } from '../helper/encodeDecode';
import { APPURL } from '../utils/config';
import VisaTemplate from '../components/VisaTemplate';
import { showToast } from '../utils/sweetAlert';
import { imageurl } from '../helper/urlChanger';
import TemplateAsImage from '../components/TemplateAsImage';

export default function QRHistory() {
  const { get, put } = useAxios()
  const [allQrCodes, setAllQrCodes] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQRItem, setSelectedQRItem] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await get('/admin/qr/getAll')
      if (res.success) {
        setAllQrCodes(res.data)
      }
    })()
  }, [])
  console.log(selectedQRItem)

  const parseQRData = (dataString: string) => {
    try {
      const parsed = JSON.parse(dataString);
      return parsed.data || parsed;
    } catch {
      return { content: dataString };
    }
  };

  const handleViewTemplate = (item: any) => {
    console.log(item)
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleViewQR = (item: any) => {
    // Convert data to string format for QR modal
    const qrItem = {
      ...item,
      data: typeof item.data === 'string' ? item.data : item.data
    };
    setSelectedQRItem(qrItem);
    setShowQRModal(true);
  };

  const handleToggleStatus = async (item: any) => {
    try {
      const newStatus = item.status === 'active' ? 'inactive' : 'active';
      const res = await put(`/admin/qr/updateStatus/${item._id}`, { status: newStatus });

      if (res.success) {
        setAllQrCodes(prev =>
          prev.map(qr =>
            qr._id === item._id ? { ...qr, status: newStatus } : qr
          )
        );
        showToast('success', `QR Code ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (error) {
      showToast('error', 'Failed to update status');
    }
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
                            {item.data.fullName || 'QR Code'}
                          </h3>

                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {parsedData.visaNumber ? `Visa: ${parsedData.visaNumber}` : ''}
                          {parsedData.nationality ? ` | ${parsedData.nationality}` : ''}
                        </p>

                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`p-2 rounded-lg transition-colors ${item.status === 'active'
                            ? 'text-white bg-green-600 hover:bg-green-700'
                            : 'text-white bg-red-600 hover:bg-red-700'
                          }`}
                        title={`${item.status === 'active' ? 'Deactivate' : 'Activate'} QR Code`}
                      >
                        {item.status === 'active' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                      <button
                        onClick={() => handleViewQR(item)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="View QR Code"
                      >
                        <Scan size={18} />
                      </button>
                      <button
                        onClick={() => handleViewTemplate(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Template"
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
      <QRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        item={selectedQRItem}
      />

      {/* Template Modal */}
      {selectedItem && showModal && (
        <TemplateViewModal
          item={selectedItem}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// Template View Modal Component
function TemplateViewModal({ item, onClose }: { item: any, onClose: () => void }) {
  const [visaData, setVisaData] = useState<any>({});

  useEffect(() => {
    if (item.data) {
      try {
        let parsedData;
        if (typeof item.data === 'string') {
          parsedData = JSON.parse(item.data);
        } else {
          parsedData = item.data;
        }
        console.log(parsedData)
        parsedData = { ...parsedData, profileImage: item.data.userImage }
        console.log(parsedData)
        setVisaData(parsedData.data || parsedData);
      } catch (error) {
        console.error('Error parsing data:', error);
        setVisaData({});
      }
    }
  }, [item.data]);

  console.log(visaData)
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{
      backgroundColor: "rgba(0, 0, 0, 0.5)"
    }}>
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Template Preview</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="transform scale-90 origin-top">
            <TemplateAsImage data={{ ...visaData, isQrDataPage: true }} />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}