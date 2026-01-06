import { useEffect, useState } from 'react';
import { Upload, Image, Trash2, X } from 'lucide-react';
import { theme } from '../theme';
import { showConfirm, showToast } from '../utils/sweetAlert';
import { useAxios } from '../hooks/useAxios';
import { imageurl } from '../helper/urlChanger';

interface Logo {
  _id: string;
  name: string;
  url: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export default function Logos() {
  const [logos, setLogos] = useState<Logo[]>([
  ]);

  const getlogos = ()=>{
    get('/image/get/logos').then((res) => {
        if (res.success) {
          setLogos(res.data)
        }
        console.log(res)
      })
  }
  useEffect(() => {
   getlogos()
  }, [])

  const { post, delete: deleteRequest, get } = useAxios()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newLogo, setNewLogo] = useState({ name: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('error', 'Please select an image file');
        return;
      }

      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      // setNewLogo({ name: file.name.replace(/\.[^/.]+$/, "") });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !newLogo.name.trim()) {
      showToast('error', 'Please select a file and enter a name');
      return;
    }

    const formdata = new FormData()
    formdata.append('image', selectedFile)
    formdata.append('name', newLogo?.name)
    const data = await post(`/image/upload/logos`, formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    if (data.success) {
      console.log(data)
      showToast('success', 'Logo uploaded successfully!');

      getlogos()

      setSelectedFile(null);
      setPreviewUrl('');
      setNewLogo({ name: '' });
      setIsUploadModalOpen(false);

    }
    // console.log(data)




  };

  const handleDeleteLogo = async (id: string) => {
    const deleteLogo = async () => {
      const res = await deleteRequest(`/image/delete/logos/${id}`)
      console.log(res)
      if (res.success) {
        setLogos(prev => prev.filter(logo => logo._id !== id));
        showToast('success', 'Logo deleted successfully');
      }
    }
    const result = await showConfirm(
      'Detele Confirmation',
      'Are you sure you want to delete this logo?',
      'Yes, Delete',
      'Cancel'
    );
    if (result.isConfirmed) {
      deleteLogo()
    }

  };

  return (
    <div className="space-y-6">
      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Upload New Logo</h3>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Image
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                    ${selectedFile ? 'bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                  style={{ borderColor: selectedFile ? theme.colors.primary.main : '' }}
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="space-y-4">
                      <div className="mx-auto w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedFile.name}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-100">
                        <Upload size={24} className="text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-2">Click to upload</p>
                      <p className="text-sm text-gray-500">PNG, JPG, SVG</p>
                    </>
                  )}
                </div>
              </div>

              {selectedFile && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Name *
                  </label>
                  <input
                    type="text"
                    value={newLogo.name}
                    onChange={(e) => setNewLogo({ name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                    style={{ '--tw-ring-color': theme.colors.primary.main } as any}
                    placeholder="Enter logo name"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile}
                  className={`flex-1 px-4 py-3 text-white rounded-lg font-medium transition-all
                    ${!selectedFile ? 'bg-gray-400 cursor-not-allowed' : 'hover:opacity-90'}`}
                  style={!selectedFile ? {} : { background: theme.gradients.primary }}
                >
                  Upload Logo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image size={32} style={{ color: theme.colors.primary.main }} />
          <h1 className="text-3xl font-bold text-gray-900">Logo Management</h1>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-3 px-6 py-3 text-white rounded-xl shadow-lg hover:opacity-90 transition-all"
          style={{ background: theme.gradients.primary }}
        >
          <Upload size={20} />
          Upload Logo
        </button>
      </div>

      {/* Logos Grid */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {logos.length === 0 ? (
          <div className="text-center py-12">
            <Image size={64} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No logos found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {logos.map((logo) => (
              <div
                key={logo._id}
                className="group border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all bg-white relative"
              >
                <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-50 border border-gray-100 mb-3">
                  <img
                    src={imageurl(logo.url)}
                    alt={logo.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{logo.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {logo.dimensions.width}×{logo.dimensions.height}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteLogo(logo._id)}
                  className="absolute top-2 right-2 p-1 bg-white text-red-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}