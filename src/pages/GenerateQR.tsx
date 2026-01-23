import { useState } from "react";
import { QrCode, Download } from "lucide-react";
import { defaultQROptions } from "../utils/qrDefaults";
import { useQRCode } from "../hooks/useQRCode";
import { QRPreview } from "../components/QRPreview";
import { showToast } from "../utils/sweetAlert";
import TemplateList from "../components/TemplateList";
import { theme } from "../theme";
// import { encodeData } from "../helper/encodeDecode";
// import { APPURL } from "../utils/config";

import { useAxios } from "../hooks/useAxios";
import { createQrUrl, imageurl } from "../helper/urlChanger";

export default function GenerateQR() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isActive, setIsActive] = useState(true);
  const { post } = useAxios()


  const { ref, generate, download } = useQRCode(defaultQROptions);

  const handleSelectTemplate = (template: any) => {
    console.log(template)
    setSelectedTemplate(template);
    // Initialize with empty values based on the object structure
    const emptyData = {
      placeOfIssuing: '',
      visaNumber: '',
      entries: '',
      issueDate: '',
      expiryDate: '',
      visaType: '',
      duration: '',
      fullName: '',
      documentNumber: '',
      sex: '',
      dateOfBirth: '',
      nationality: '',
      issuingAuthority: '',
      info: template?.dynamicData?.info,
      processNumber: '',
      profileImage: '',
      logoImage: template.dynamicData?.logoImage || ''
    };
    setFormData(emptyData);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imagePayload = new FormData()
    imagePayload.append('image', file)
    const userImages = await post('/image/uploaduserImage', imagePayload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    if (userImages.success) {
      setFormData((prev: any) => ({
        ...prev,
        profileImage: imageurl(userImages.file.path),
        imageHalfurl: userImages.file.path
      }));
    }
    console.log(userImages)
    return
    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   setFormData((prev: any) => ({
    //     ...prev,
    //     profileImage: reader.result as string
    //   }));
    //   showToast("success", "Profile image uploaded");
    // };
    // reader.readAsDataURL(file);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      showToast("error", "Please select a template first");
      return;
    }

    // Check required fields
    const fields = [
      { key: 'placeOfIssuing', label: 'Place of Issuing', required: true },
      { key: 'visaNumber', label: 'Visa Number', required: true },
      { key: 'entries', label: 'Entries', required: true },
      { key: 'issueDate', label: 'Issue Date', required: true },
      { key: 'expiryDate', label: 'Expiry Date', required: true },
      { key: 'visaType', label: 'Visa Type', required: true },
      { key: 'duration', label: 'Duration', required: true },
      { key: 'fullName', label: 'Full Name', required: true },
      { key: 'documentNumber', label: 'Document Number', required: true },
      { key: 'sex', label: 'Sex', required: true },
      { key: 'dateOfBirth', label: 'Date of Birth', required: true },
      { key: 'nationality', label: 'Nationality', required: true },
      { key: 'issuingAuthority', label: 'Issuing Authority', required: true },
      { key: 'info', label: 'Info', required: true },
      { key: 'verificationCode', label: 'Code', required: true }
    ];

    for (const field of fields) {
      if (field.required && (!formData[field.key] || formData[field.key].trim() === '')) {
        showToast("error", `${field.label} is required`);
        return;
      }
    }

    const payload = {
      ...formData,
      templateId: selectedTemplate._id,
      userImage: formData.imageHalfurl
    }

    const res = await post('/admin/qr/create', {
      data: payload,
      options: defaultQROptions
    })

    if (res.success) {
      // const optiondata = {
      //   _id: res.qr._id,
      //   tempalateId: res.qr.data.templateId,
      //   status: res.qr.status,
      //   code: res.qr?.data?.verificationCode,
      //   applicationNumber: res.qr?.data?.visaNumber,
      // }

      const fullUrl = createQrUrl(res?.qr?.token)
      generate(fullUrl)
      showToast("success", "QR Code generated successfully!");
    }
  };

  const handleDownload = () => {
    download("png");
  };

  const renderFormFields = () => {
    if (!selectedTemplate) return null;

    const fields = [
      { key: 'placeOfIssuing', label: 'Place of Issuing', type: 'text', required: true },
      { key: 'visaNumber', label: 'Visa Number', type: 'text', required: true },
      { key: 'entries', label: 'Entries', type: 'text', required: true },
      { key: 'issueDate', label: 'Issue Date', type: 'text', required: true },
      { key: 'expiryDate', label: 'Expiry Date', type: 'text', required: true },
      { key: 'visaType', label: 'Visa Type', type: 'text', required: true },
      { key: 'duration', label: 'Duration', type: 'text', required: true },
      { key: 'fullName', label: 'Full Name', type: 'text', required: true },
      { key: 'documentNumber', label: 'Document Number', type: 'text', required: true },
      { key: 'sex', label: 'Sex', type: 'select', options: ['M', 'F', 'Others'], required: true },
      { key: 'dateOfBirth', label: 'Date of Birth', type: 'text', required: true },
      { key: 'nationality', label: 'Nationality', type: 'text', required: true },
      { key: 'issuingAuthority', label: 'Issuing Authority', type: 'text', required: true },
      // { key: 'processNumber', label: 'Process Number', type: 'text', required: true },
      { key: 'info', label: 'Info', type: 'textarea', required: true },
      { key: 'verificationCode', label: 'Code', type: 'test', required: true },

    ];

    return (
      <div className="space-y-4">
        {/* Profile Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <div className="flex items-center gap-4">
            <div className="relative">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-400">Photo</span>
                </div>
              )}
            </div>
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <span>Upload Image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Form Fields */}
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && '*'}
            </label>
            {field.type === 'select' ? (
              <select
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                required={field.required}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none resize-none"
                rows={field.key === 'info' ? 4 : 3}
                required={field.required}
              />
            ) : (
              <input
                type={field.type}
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                required={field.required}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <QrCode size={32} style={{ color: theme.colors.primary.main }} />
          <h1 className="text-3xl font-bold text-gray-900">Generate QR Code</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Status:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <div
              className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
              style={{ backgroundColor: isActive ? theme.colors.primary.main : '' }}
            />
            <span className="ml-2 text-sm font-medium">
              {isActive ? "Active" : "Disabled"}
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {!selectedTemplate ? (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Template</h2>
              <TemplateList onSelectTemplate={handleSelectTemplate} />
            </div>
          ) : (
            <>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Template: {selectedTemplate.templateName}
                  </h2>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Change Template
                  </button>
                </div>
                {renderFormFields()}
              </div>
            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-6 sticky top-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">QR Preview</h3>
              <p className="text-sm text-gray-600 mt-1">Scan to view data</p>
            </div>

            <div className="p-4 border-2 border-gray-100 rounded-xl bg-white">
              <QRPreview qrRef={ref} />
            </div>

            {selectedTemplate && formData.fullName && (
              <div className="text-center">
                <p className="font-medium">{formData.fullName}</p>
                <p className="text-sm text-gray-600">{formData.visaNumber}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleGenerate}
                disabled={!selectedTemplate}
                className="w-full px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: theme.gradients.primary }}
              >
                <QrCode size={18} />
                Generate QR Code
              </button>

              <button
                onClick={handleDownload}
                className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download QR
              </button>
            </div>
          </div>

          {/* <div className="bg-white p-4 rounded-xl shadow-lg sticky top-96">
            <h4 className="font-medium text-gray-800 mb-2">QR Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Template:</span>
                <span className="text-sm font-mono">{selectedTemplate?.templateName || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="text-sm" style={{ color: isActive ? theme.colors.primary.main : '#ef4444' }}>
                  {isActive ? "Active" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="text-sm">{selectedTemplate?.templateType || 'N/A'}</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}