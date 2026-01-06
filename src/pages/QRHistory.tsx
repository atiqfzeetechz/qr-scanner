// @ts-nocheck
import { useEffect, useState } from 'react';
import { History, QrCode, Scan, Download, Eye, Trash2 } from 'lucide-react';
import { theme } from '../theme';
import { showToast, showDeleteConfirm } from '../utils/sweetAlert';
import { useAxios } from '../hooks/useAxios';
import { QRModal } from '../components/QRModal';



export default function QRHistory() {
  const { get } = useAxios()
  const [allQrCodes, setAllQrCodes] = useState<any[]>([])
console.log(allQrCodes)

  useEffect(() => {
    (async () => {
      const res = await get('/admin/qr/getAll')
      if (res.success) {
        setAllQrCodes(res.data)
      }
      console.log(res)
    })()
  }, [])



  const [filter, setFilter] = useState<'all' | 'generated' | 'scanned'>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);



  const handleDelete = async (id: any) => {
    const result = await showDeleteConfirm('this QR code record');
    if (result.isConfirmed) {
      setAllQrCodes((prev: any[]) => prev.filter((item: any) => item.id !== id));
      showToast('success', 'QR code record deleted successfully!');
    }
  };

  const handleDownload = (item: any) => {
    if (item.type === 'generated') {
      const link = document.createElement('a');
      link.href = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(item.data)}`;
      link.download = `qrcode-${item.id}.png`;
      link.click();
      showToast('success', 'QR Code downloaded!');
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
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                ? 'text-white'
                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
              style={filter === 'all' ? { background: theme.gradients.primary } : {}}
            >
              All
            </button>
            <button
              onClick={() => setFilter('generated')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'generated'
                ? 'text-white'
                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
              style={filter === 'generated' ? { background: theme.gradients.primary } : {}}
            >
              Generated
            </button>
            <button
              onClick={() => setFilter('scanned')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'scanned'
                ? 'text-white'
                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
              style={filter === 'scanned' ? { background: theme.gradients.primary } : {}}
            >
              Scanned
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {allQrCodes.length === 0 ? (
            <div className="text-center py-12">
              <History size={64} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No QR code history found</p>
            </div>
          ) : (
            allQrCodes.map((item: any) => (
              <div key={item?.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${theme.colors.primary.main}20` }}>
                      {item.type === 'generated' ? (
                        <QrCode size={24} style={{ color: theme.colors.primary.main }} />
                      ) : (
                        <Scan size={24} style={{ color: theme.colors.primary.main }} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.title || `${item.type === 'generated' ? 'Generated' : 'Scanned'} QR Code`}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${item.type === 'generated'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                          }`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 truncate">{item.data}</p>
                      <p className="text-gray-400 text-xs">{formatDate(item?.updatedAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleView(item)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="View details"
                    >
                      <Eye size={18} />
                    </button>

                    {item.type === 'generated' && (
                      <button
                        onClick={() => handleDownload(item)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Download QR code"
                      >
                        <Download size={18} />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <QRModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        item={selectedItem} 
      />
    </div>
  );
}