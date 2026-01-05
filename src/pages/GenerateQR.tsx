import { useState } from "react";
import { QrCode, Download, Plus, Trash2, Upload, Image, User, Phone, MapPin, Settings } from "lucide-react";
import { defaultQROptions } from "../utils/qrDefaults";
import { useQRCode } from "../hooks/useQRCode";
import { QRPreview } from "../components/QRPreview";
import { showToast } from "../utils/sweetAlert";
import { useAxios } from "../hooks/useAxios";
import { theme } from "../theme";

interface UserData {
  name: string;
  phone: string;
  address: string;
  email: string;
  customFields: { key: string; value: string }[];
  profileImage: string;
}

interface QRTemplate {
  id: string;
  name: string;
  backgroundColor: string;
  layout: string;
  styles: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
  };
  isGlobal: boolean;
}

export default function GenerateQR() {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    phone: "",
    address: "",
    email: "",
    customFields: [],
    profileImage: ""
  });

  const [customField, setCustomField] = useState({ key: "", value: "" });
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isActive, setIsActive] = useState(true);
  const [templates] = useState<QRTemplate[]>([
    { id: "1", name: "Default Template", backgroundColor: "#FFFFFF", layout: "standard", styles: { fontFamily: "Inter", primaryColor: "#000000", secondaryColor: "#666666" }, isGlobal: false },
    { id: "2", name: "Dark Theme", backgroundColor: "#1a1a1a", layout: "compact", styles: { fontFamily: "Roboto", primaryColor: "#FFFFFF", secondaryColor: "#999999" }, isGlobal: false },
  ]);

  const { ref, generate, download } = useQRCode(defaultQROptions);
  const { post } = useAxios();

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddCustomField = () => {
    if (!customField.key.trim() || !customField.value.trim()) {
      showToast("error", "Please enter both field name and value");
      return;
    }

    setUserData(prev => ({
      ...prev,
      customFields: [...prev.customFields, { ...customField }]
    }));
    
    setCustomField({ key: "", value: "" });
    showToast("success", "Custom field added");
  };

  const handleRemoveCustomField = (index: number) => {
    setUserData(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({
          ...prev,
          profileImage: reader.result as string
        }));
        showToast("success", "Profile image uploaded");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!userData.name.trim() || !userData.phone.trim() || !userData.address.trim()) {
      showToast("error", "Please fill all required fields (Name, Phone, Address)");
      return;
    }

    const qrData = {
      type: "user_profile",
      version: "1.0",
      timestamp: new Date().toISOString(),
      data: userData,
      template: selectedTemplate,
      isActive: isActive,
      metadata: {
        generatedBy: "admin_panel",
        generationDate: new Date().toISOString()
      }
    };

    const qrString = JSON.stringify(qrData);
    generate(qrString);
    showToast("success", "QR Code generated successfully!");
  };

  const handleDownload = () => {
    download("png");
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
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <User size={20} style={{ color: theme.colors.primary.main }} />
              User Information
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                    style={{ '--tw-ring-color': theme.colors.primary.main, borderColor: 'focus:' + theme.colors.primary.main } as any}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                      style={{ '--tw-ring-color': theme.colors.primary.main } as any}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      value={userData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none resize-none"
                      style={{ '--tw-ring-color': theme.colors.primary.main } as any}
                      placeholder="Enter complete address"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                    style={{ '--tw-ring-color': theme.colors.primary.main } as any}
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image / Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {userData.profileImage ? (
                      <img
                        src={userData.profileImage}
                        alt="Profile"
                        className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <Image size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Upload size={16} />
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
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Settings size={20} style={{ color: theme.colors.primary.main }} />
              Custom Fields
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Name
                  </label>
                  <input
                    type="text"
                    value={customField.key}
                    onChange={(e) => setCustomField(prev => ({ ...prev, key: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                    style={{ '--tw-ring-color': theme.colors.primary.main } as any}
                    placeholder="e.g., Department, Role, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Value
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customField.value}
                      onChange={(e) => setCustomField(prev => ({ ...prev, value: e.target.value }))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                      style={{ '--tw-ring-color': theme.colors.primary.main } as any}
                      placeholder="Enter value"
                    />
                    <button
                      onClick={handleAddCustomField}
                      className="px-4 py-2 text-white rounded-lg hover:opacity-90 flex items-center gap-2"
                      style={{ background: theme.gradients.primary }}
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {userData.customFields.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Field Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Value</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {userData.customFields.map((field, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{field.key}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{field.value}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleRemoveCustomField(index)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Remove field"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    borderColor: selectedTemplate === template.id ? theme.colors.primary.main : ''
                  }}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{template.layout} layout</p>
                    </div>
                    {template.isGlobal && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Global
                      </span>
                    )}
                  </div>
                  <div 
                    className="mt-3 h-2 rounded-full"
                    style={{ backgroundColor: template.backgroundColor }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">QR Preview</h3>
              <p className="text-sm text-gray-600 mt-1">Scan to view profile</p>
            </div>

            <div className="p-4 border-2 border-gray-100 rounded-xl bg-white">
              <QRPreview qrRef={ref} />
            </div>

            {userData.name && (
              <div className="text-center">
                <p className="font-medium">{userData.name}</p>
                <p className="text-sm text-gray-600">{userData.phone}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleGenerate}
                className="w-full px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
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

          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h4 className="font-medium text-gray-800 mb-2">QR Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">QR ID:</span>
                <span className="text-sm font-mono">Generated</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="text-sm" style={{ color: isActive ? theme.colors.primary.main : '#ef4444' }}>
                  {isActive ? "Active" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fields:</span>
                <span className="text-sm">{userData.customFields.length} custom</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}