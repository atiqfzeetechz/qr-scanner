import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useQRCodeView } from '../hooks/useQRCodeView';
import { QRPreview } from './QRPreview';
import { theme } from '../theme';
import { encodeData } from '../helper/encodeDecode';
import { APPURL } from '../utils/config';


interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: any;
}

export const QRModal = ({ isOpen, onClose, item }: Props) => {
  const { ref: qrRef, display } = useQRCodeView({
    width: 200,
    height: 200,
    margin: 10,
  });

  useEffect(() => {
    if (isOpen && item) {
      console.log(item)
           const optiondata = {
              _id: item?._id,
              tempalateId: item?.data.templateId,
              status: item?.status,
              code:item?.data?.verificationCode,
              applicationNumber:item?.data?.visaNumber,
         
             
            }
            const url = encodeData(optiondata)
            const fullurl = `${APPURL}/${url}`
            console.log(fullurl)
            setTimeout(() => {
        display(fullurl)
      
      }, 100);
    }
  }, [isOpen, item, display]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: `${theme.colors.neutral[900]}99` }} // #171717 with 60% opacity
    >
      <div 
        className="rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{ 
          background: theme.gradients.dark,
          color: theme.colors.neutral[50]
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6 pb-4 border-b"
          style={{ borderColor: theme.colors.neutral[800] }}
        >
          <div>
            <h3 className="text-xl font-bold">QR Code Details</h3>
            <p 
              className="text-sm mt-1"
              style={{ color: 'white' }}
            >
              Scan to view data
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors duration-200 hover:opacity-80"
            style={{ 
              backgroundColor: theme.colors.neutral[800],
              color: theme.colors.neutral[300]
            }}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Data Section */}
         

          {/* QR Code Section */}
          <div 
         
            style={{ borderColor: theme.colors.neutral[800] }}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="mb-2">
                <p className="text-center font-medium mb-1">Scan this QR Code</p>
                <p 
                  className="text-center text-sm"
                 
                >
                  Use any QR scanner app
                </p>
              </div>
              
              {/* QR Code Container */}
              <div 
                className="p-6 rounded-xl border-2"
                style={{ 
                  backgroundColor: theme.colors.neutral[800],
                  borderColor: theme.colors.neutral[700]
                }}
              >
                <QRPreview qrRef={qrRef} />
              </div>
              
              {/* Visual indicators */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.colors.success }}
                  ></div>
                  <span>Valid QR Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.colors.secondary.light }}
                  ></div>
                  <span>UTF-8 Encoded</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="px-6 py-4 border-t"
          style={{ 
            backgroundColor: theme.colors.neutral[900],
            borderColor: theme.colors.neutral[800]
          }}
        >
      
        </div>
      </div>
    </div>
  );
};