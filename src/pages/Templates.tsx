// @ts-nocheck
import { useState, useEffect } from "react";

// @ts-nocheck
import QRCode from "qrcode";
import VisaTemplate from "../components/VisaTemplate";
import TemplateList from "../components/TemplateList";
import { useAxios } from "../hooks/useAxios";
import { imageurl } from "../helper/urlChanger";
import TemplateAsImage from "../components/TemplateAsImage";

const TemplateBuilder = () => {
  const { get } = useAxios();
  const [showTemplateList, setShowTemplateList] = useState(false);
  const [logos, setLogos] = useState<any[]>([]);
  const [selectedLogo, setSelectedLogo] = useState<any>(null);
  const [customFields, setCustomFields] = useState<any[]>([
  ]);
  const [newField, setNewField] = useState<any>({ key: "", value: "" });

  const visaData = {
    fullName: "ANTHONY CIVIL",
    placeOfIssuing: "PORTO PRÍNCIPE",
    visaNumber: "251020-504973",
    issueDate: "17 DEZ/DEC 2025",
    expiryDate: "21 DEZ/DEC 2026",
    duration: "365 DIAS/DAYS",
    documentNumber: "R12707793",
    nationality: "HAITIANO",
    sex: "M",
    dateOfBirth: "06 FEV/FEB 2004",
    issuingAuthority: "PORTO PRINCIPE EMB",
    processNumber: "08228.042643/2023-72",
    entries: "ÚNICA/SINGLE",
    visaType: "VITEM XI",
    verificationCode: "GWZG.FQHL.6TCW.3PLF",
    info: "RESIDÊNCIA PRÉVIA - PORTARIAS INTERMINISTERIAIS MJSP/MRE Nº 38/2023 E 55/2025. PROCESSO Nº: 08228.030381/2024-67. CHAMANTE: MARC NORMIL. REGISTRO JUNTO À POLÍCIA FEDERAL DENTRO DE 90 (NOVENTA) DIAS DA PRIMEIRA ENTRADA NO PAÍS.",
    customFields: customFields
  };
  const [data, setData] = useState<any>(visaData);

  // Update data when customFields change
  useEffect(() => {
    setData(prev => ({ ...prev, customFields }));
  }, [customFields]);

  useEffect(() => {
    (async () => {
      const res = await get('/image/get/logos');
      if (res.success) {
        setLogos(res.data);
      }
    })()
  }, []);

  const handleLogoSelect = (logo: any) => {
    setSelectedLogo(logo);
    setData(prev => ({ ...prev, logoImage: imageurl(logo.url || logo.data) }));
  };

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const addCustomField = () => {
    if (!newField.key.trim() || !newField.value.trim()) {
      alert('Please enter both field name and value');
      return;
    }
    setCustomFields((prev: any) => [...prev, { ...newField }]);
    setNewField({ key: "", value: "" });
  };

  const removeCustomField = (index: number) => {
    setCustomFields((prev: any) => prev.filter((_: any, i: number) => i !== index));
  };

  const updateCustomField = (index: number, field: string, newValue: string) => {
    setCustomFields((prev: any) => prev.map((item: any, i: number) =>
      i === index ? { ...item, [field]: newValue } : item
    ));
  };

  const handleSelectTemplate = (template: any) => {
    setData(template.dynamicData);
    setCustomFields(template.customFields || []);
    setShowTemplateList(false);
  };

  const generateQR = async () => {
    const qrVisaData = {
      fullName: data.fullName,
      documentNumber: data.documentNumber,
      nationality: data.nationality,
      visaNumber: data.visaNumber,
      expiryDate: data.expiryDate,
      sex: data.sex,
      dateOfBirth: data.dateOfBirth,
      placeOfIssuing: data.placeOfIssuing,
      issueDate: data.issueDate,
      duration: data.duration,
      issuingAuthority: data.issuingAuthority,
      processNumber: data.processNumber,
      logoImage: data.logoImage
    };

    // Encode data and create URL that opens template
    const encodedData = btoa(JSON.stringify(qrVisaData));
    const templateUrl = `${window.location.origin}/visa-view?data=${encodedData}`;

    const qr = await QRCode.toDataURL(templateUrl);
    setData((prev: any) => ({ ...prev, qrCode: qr }));
  };

  return (
    <div>
      {/* Header with Template List Toggle */}
      <div style={{
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2 style={{ margin: 0, color: "#0066CC" }}>Template Builder</h2>
        <button
          onClick={() => setShowTemplateList(!showTemplateList)}
          style={{
            padding: "10px 20px",
            backgroundColor: showTemplateList ? "#dc3545" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold"
          }}
        >
          {showTemplateList ? "Hide Templates" : "Show Templates"}
        </button>
      </div>

      {/* Template List */}
      {showTemplateList && (
        <div style={{
          backgroundColor: "white",
          borderBottom: "1px solid #ddd",
          maxHeight: "400px",
          overflowY: "auto"
        }}>
          <TemplateList onSelectTemplate={handleSelectTemplate} />
        </div>
      )}

      {/* Main Template Builder */}
      <div style={{ display: "flex", height: showTemplateList ? "calc(100vh - 500px)" : "calc(100vh - 100px)" }}>

        {/* FORM - Scrollable Left Side */}
        <div style={{
          width: "55%",
          // padding: "20px", 
          backgroundColor: "#f8f9fa",
          overflowY: "auto",
          maxHeight: "100vh",
          paddingBottom: "100px"
        }}>
          <h3 style={{ color: "#0066CC", marginBottom: "20px" }}>Visa Template Fields</h3>

          <div style={{ display: "grid", gap: "8px" }}>
            {/* Logo Selection */}
            <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <h4 style={{ color: "#333", marginBottom: "10px", fontSize: "14px" }}>Select Logo</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))", gap: "8px", maxHeight: "120px", overflowY: "auto" }}>
                {logos.map((logo: any) => (
                  <div
                    key={logo._id}
                    onClick={() => handleLogoSelect(logo)}
                    style={{
                      width: "60px",
                      height: "60px",
                      border: selectedLogo?.id === logo.id ? "2px solid #0066CC" : "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <img
                      src={imageurl(logo.url || logo.data)}
                      alt={logo.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
              {selectedLogo && (
                <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>Selected: {selectedLogo.name}</p>
              )}
            </div>

            {/* Basic Information */}
            <div className="tempalteinputCards" style={{ backgroundColor: "white", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} >

              {/* issue place */}
              <label htmlFor="placeOfIssuing" className="formlabel">OCAL DE EMISSÃ/Place of issuing</label>
              <input className="inputfiled"
                name="placeOfIssuing"
                placeholder="Place of Issuing"
                value={data.placeOfIssuing || ''}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
              />

              {/* visa number  */}
              <label htmlFor="visaNumber" className="formlabel">Nº DO VISTO/Visa Number</label>
              <input className="inputfiled"
                name="visaNumber"
                placeholder="Visa Number"
                value={data.visaNumber || ''}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
              />

              {/* Number of entries  */}
              <label htmlFor="entries" className="formlabel">Nº DE ENTRADAS/No. OF ENTRIES</label>
              <input className="inputfiled"
                name="entries"
                placeholder="No. OF ENTRIES"
                value={data.entries || ''}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
              />
              {/* date of issue */}
              <label htmlFor="issueDate" className="formlabel">DATA DE EMISSÃO/DATE OF ISSUE</label>
              <input className="inputfiled"
                name="issueDate"
                placeholder="Issue Date (e.g., 17 DEZ/DEC 2025)"
                value={data.issueDate || ''}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
              />
              {/* date of expiry */}
              <label htmlFor="expiryDate" className="formlabel">DATA DE VALIDADE/DATE OF EXPIRY</label>
              <input className="inputfiled"
                name="expiryDate"
                placeholder="Expiry Date (e.g., 21 DEZ/DEC 2026)"
                value={data.expiryDate || ''}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
              />

              {/* Visa Type */}
              <label htmlFor="visaType" className="formlabel">TIPO DO VISTO/TYPE OF VISA</label>
              <input className="inputfiled"
                name="visaType"
                placeholder="TIPO DO VISTO/TYPE OF VISA"
                value={data.visaType || ''}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
              />
              {/* Duration of Visa */}
              <label htmlFor="duration" className="formlabel">PRAZO DE ESTADA/DURATION OF STAY</label>
              <input className="inputfiled"
                name="duration"
                placeholder="Duration (e.g., 365 DIAS/DAYS)"
                value={data.duration || ''}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
              />

              {/*Full Name */}
              <label htmlFor="fullName" className="formlabel">OME COMPLETO/FULL NAME</label>
              <input className="inputfiled"
                name="fullName"
                placeholder="Full Name"
                value={data.fullName || ''}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
              />
              {/*Travel Dopcument Number */}
              <label htmlFor="documentNumber" className="formlabel">DOCUMENTO Nº/TRAVEL DOC. No.</label>
              <input className="inputfiled"
                name="documentNumber"
                placeholder="Document Number"
                value={data.documentNumber || ''}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
              />
              {/*Sex*/}
              <label htmlFor="sex" className="formlabel">SEXO/SEX</label>
              <select
                name="sex"
                value={data.sex || ''}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
              >
                <option value="">Select Sex</option>
                <option value="M">M (Male)</option>
                <option value="F">F (Female)</option>
              </select>

              {/*DATA DE NASCIMENTO/DATE OF BIRTH*/}
              <label htmlFor="dateOfBirth" className="formlabel">DATA DE NASCIMENTO/DATE OF BIRTH</label>
              <input className="inputfiled"
                name="dateOfBirth"
                placeholder="Date of Birth (e.g., 06 FEV/FEB 2004)"
                value={data.dateOfBirth || ''}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
              />
              {/*ACIONALIDADE/NATIONALITY*/}
              <label htmlFor="nationality" className="formlabel">ACIONALIDADE/NATIONALITY</label>
              <input className="inputfiled"
                name="nationality"
                placeholder="Nationality"
                value={data.nationality || ''}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
              />

              {/*UTORIDADE EMISSORA/ISSUING AUTHORITY*/}
              <label htmlFor="issuingAuthority" className="formlabel">UTORIDADE EMISSORA/ISSUING AUTHORITY</label>
              <input className="inputfiled"
                name="issuingAuthority"
                placeholder="Issuing Authority"
                value={data.issuingAuthority || ''}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
              />

              {/*info*/}
              <label htmlFor="info" className="formlabel">Info</label>
              <textarea className="inputfiled"
                name="info"
                rows={5}
                placeholder="Info"
                value={data.info || ''}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
              />

              <label htmlFor="verificationCode" className="formlabel">Code</label>
              <input className="inputfiled"
                name="verificationCode"
                placeholder="Code"
                value={data.verificationCode || ''}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
              />
            </div>



            {/* Authority Information */}
            {/* <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <h4 style={{ color: "#333", marginBottom: "10px", fontSize: "14px" }}>Authority Information</h4>

              <input className="inputfiled"
                name="processNumber"
                placeholder="Process Number"
                value={data.processNumber || ''}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
              />
            </div> */}

            {/* Dynamic Fields Section */}
            <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <h4 style={{ color: "#333", marginBottom: "10px", fontSize: "14px" }}>Dynamic Fields</h4>

              {/* Add New Field */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input className="inputfiled"
                  placeholder="Field Name"
                  value={newField.key}
                  onChange={(e: any) => setNewField((prev: any) => ({ ...prev, key: e.target.value }))}
                  style={{ flex: 1, padding: "2px 6px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "8px" }}
                />
                <input className="inputfiled"
                  placeholder="Field Value"
                  value={newField.value}
                  onChange={(e: any) => setNewField((prev: any) => ({ ...prev, value: e.target.value }))}
                  style={{ flex: 1, padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
                />
                <button
                  onClick={addCustomField}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Add Field
                </button>
              </div>

              {/* Existing Custom Fields */}
              {customFields.map((field: any, index: number) => (
                <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                  <input className="inputfiled"
                    value={field.key}
                    onChange={(e: any) => updateCustomField(index, 'key', e.target.value)}
                    style={{ flex: 1, padding: "6px 10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "13px" }}
                  />
                  <input className="inputfiled"
                    value={field.value}
                    onChange={(e: any) => updateCustomField(index, 'value', e.target.value)}
                    style={{ flex: 1, padding: "6px 10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "13px" }}
                  />
                  <button
                    onClick={() => removeCustomField(index)}
                    style={{
                      padding: "6px 10px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>


            {/* <button
              onClick={generateQR}
              style={{
                padding: "8px 16px",
                backgroundColor: "#0066CC",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Generate QR Code
            </button> */}
          </div>
        </div>

        {/* PREVIEW - Fixed Right Side */}
        <div style={{
          width: "60%",
          padding: "20px",
          backgroundColor: "white",
          overflowY: "auto",
          maxHeight: "100vh"
        }}>
          <div style={{ width: "100%" }}>
            <TemplateAsImage data={data} showSaveButton={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateBuilder;
