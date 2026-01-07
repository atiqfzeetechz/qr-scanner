import React, { useEffect, useState } from "react";
import { showInputDialog, showSuccess } from '../utils/sweetAlert';
import "../styles/styles.css";
import { useAxios } from "../hooks/useAxios";
import { imageurl } from "../helper/urlChanger";

interface CustomField {
    key: string;
    value: string;
}

interface VisaData {
    fullName?: string;
    phone?: string;
    address?: string;
    customFields?: CustomField[];
    profileImage?: string;
    logoImage?: string;
    placeOfIssuing?: string;
    visaNumber?: string;
    issueDate?: string;
    expiryDate?: string;
    duration?: string;
    documentNumber?: string;
    nationality?: string;
    sex?: string;
    dateOfBirth?: string;
    issuingAuthority?: string;
    processNumber?: string;
    isQrDataPage?: boolean;
    [key: string]: any;
}

interface VisaTemplateProps {
    data: VisaData;
}

const VisaTemplate: React.FC<VisaTemplateProps> = ({ data }) => {
    const {
        fullName = '',
        phone = '',
        address = '',
        customFields = [],
        profileImage,
        logoImage,
        placeOfIssuing = 'PORTO PRÍNCIPE',
        visaNumber = '251020-504973',
        issueDate = '17 DEZ/DEC 2025',
        expiryDate = '21 DEZ/DEC 2026',
        duration = '365 DIAS/DAYS',
        documentNumber = 'R12707793',
        nationality = 'HAITIANO',
        sex = 'M',
        dateOfBirth = '06 FEV/FEB 2004',
        issuingAuthority = 'PORTO PRINCIPE EMB',
        processNumber = '08228.042643/2023-72'
    } = data;

    const { post, get } = useAxios()
    const [allTemplates, setAlltemplates] = useState([])

    const getTemplates = async () => {
        console.log(allTemplates)
        try {
            const res = await get('/admin/template/get')
            console.log(res)
            if (res.success) {
                setAlltemplates(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => {
        getTemplates()
    }, [])

    const saveTemplate = async () => {
        const { value: templateName } = await showInputDialog(
            'Save Template',
            'Template Name',
            'Brazil e-Visa v1'
        );

        if (templateName) {
            const templateData = {
                templateName,
                templateType: "VISA",
                description: "Brazil electronic visa template with QR verification",
                status: "ACTIVE",
                layout: {
                    width: "768px",
                    height: "auto",
                    background: "#ffffff"
                },
                staticFields: {
                    country: "FEDERATIVE REPUBLIC OF BRAZIL",
                    documentTitle: "ELECTRONIC VISA",
                    issuingAuthority: "POLICIA FEDERAL"
                },
                dynamicData: {
                    fullName: fullName || "ANTHONY CIVIL",
                    placeOfIssuing,
                    visaNumber,
                    issueDate,
                    expiryDate,
                    duration,
                    documentNumber,
                    nationality,
                    sex,
                    dateOfBirth,
                    phone: phone || "+55 99999 8888",
                    address: address || "São Paulo, Brazil",
                    processNumber,
                    profileImage,
                    logoImage
                },
                customFields: customFields.length > 0 ? customFields : [
                    { key: "Occupation", value: "Engineer" },
                    { key: "Purpose of Visit", value: "Tourism" }
                ],
                qrConfig: {
                    enabled: true,
                    size: 150,
                    position: "BOTTOM_CENTER",
                    dataSource: "VERIFY_URL",
                    verifyUrl: "https://visa-haiti.serpro.gov.br/verify",
                    payloadKeys: ["visaNumber", "documentNumber", "fullName"]
                },
                meta: {
                    version: "1.0",
                    createdBy: "ADMIN",
                    remarks: "Initial visa template"
                }
            };
            const res = await post('/admin/template/create', templateData)
            if (res.success) {
                showSuccess('Saved!', 'Template saved successfully!');
            }
            console.log(res)

            localStorage.setItem('visaTemplate', JSON.stringify(templateData));

        }
    };


    return (
        <div className="document-container">
            <button
                onClick={saveTemplate}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#0066CC',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    zIndex: 1000
                }}
            >
                Save Template
            </button>
            <div className="document">

                {/* ================= HEADER ================= */}
                <header className="document-header">
                    <div className="coat-of-arms">
                        {logoImage ? (
                            <img
                                src={logoImage}
                                alt="Logo"
                                style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                            />
                        ) : (
                            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                <circle cx="30" cy="30" r="28" fill="#228B22" stroke="#FFD700" strokeWidth="2" />
                                <circle cx="30" cy="30" r="20" fill="#0066CC" />
                                <path d="M15 30 Q30 15 45 30 Q30 45 15 30" fill="#FFD700" />
                                <circle cx="30" cy="30" r="8" fill="#228B22" />
                                <rect x="25" y="25" width="10" height="10" fill="#FFD700" />
                            </svg>
                        )}
                    </div>

                    <div className="header-text">
                        <h1 style={{ color: '#0066CC' }}>FEDERATIVE REPUBLIC OF BRAZIL</h1>
                        <h2 style={{ color: '#0066CC' }}>ELECTRONIC VISA</h2>
                    </div>
                </header>

                {/* ================= MAIN CONTENT ================= */}
                <main className="document-content" style={{ display: 'flex', margin: '10px 0' }}>

                    {/* LEFT COLUMN - Photo Section */}
                    <div className="left-column" style={{ width: '35%', padding: '10px' }}>
                        <div className="photo-placeholder" style={{ height: '200px', marginBottom: '0px', width: "200px" }}>
                            <div className="photo-frame" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f8f8', border: '1px solid #ddd' }}>
                                {profileImage ? (
                                    <img
                                        src={imageurl(profileImage)}
                                        alt="Profile"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <span style={{ color: '#999', fontSize: '14px', fontWeight: 'bold' }}>PHOTO</span>
                                )}
                            </div>
                        </div>

                        <div className="coat-of-arms-small" style={{ alignSelf: 'center', }}>
                            {logoImage ? (
                                <img
                                    src={logoImage}
                                    alt="Logo"
                                    style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                                />
                            ) : (
                                <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                                    <circle cx="25" cy="25" r="23" fill="#228B22" stroke="#FFD700" strokeWidth="2" />
                                    <circle cx="25" cy="25" r="15" fill="#0066CC" />
                                    <path d="M12 25 Q25 12 38 25 Q25 38 12 25" fill="#FFD700" />
                                    <circle cx="25" cy="25" r="6" fill="#228B22" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Visa Details */}
                    <div className="right-column" style={{ width: '75%', padding: '10px', fontSize: '11px', lineHeight: '1.2' }}>
                        <div className="visa-info">
                            {/* First Row */}
                            <div style={{ display: 'flex', marginBottom: '8px' }}>
                                <div style={{ width: '50%' }}>
                                    <div style={{ color: '#0066CC', fontWeight: 'bold', fontSize: '10px' }}>BRASIL/BRAZIL</div>
                                    <div style={{ color: '#0066CC', fontSize: '9px' }}>LOCAL DE EMISSÃO/PLACE OF ISSUING</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '10px' }}>{placeOfIssuing}</div>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <div style={{ color: '#0066CC', fontWeight: 'bold', fontSize: '10px' }}>VISTO/VISA</div>
                                    <div style={{ color: '#0066CC', fontSize: '9px' }}>Nº DO VISTO/VISA No</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '10px' }}>{visaNumber}</div>
                                </div>
                            </div>

                            {/* Second Row */}
                            <div style={{ display: 'flex', marginBottom: '8px' }}>
                                <div style={{ width: '50%' }}>
                                    <div style={{ color: '#0066CC', fontSize: '9px' }}>No DE ENTRADAS/No. OF ENTRIES</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '10px' }}>ÚNICA/SINGLE</div>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <div style={{ color: '#0066CC', fontSize: '9px' }}>DATA DE EMISSÃO/DATE OF ISSUE</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '10px' }}>{issueDate}</div>
                                </div>
                            </div>

                            {/* Third Row */}
                            <div style={{ display: 'flex', marginBottom: '8px' }}>
                                <div style={{ width: '50%' }}>
                                    <div style={{ color: '#0066CC', fontSize: '9px' }}>TIPO DO VISTO/TYPE OF VISA</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '10px' }}>VITEM XI</div>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <div style={{ color: '#0066CC', fontSize: '9px' }}>DATA DE VALIDADE/DATE OF EXPIRY</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '10px' }}>{expiryDate}</div>
                                </div>
                            </div>

                            {/* Duration */}
                            <div style={{ marginBottom: '8px' }}>
                                <span style={{ color: '#0066CC', fontSize: '9px' }}>PRAZO DE ESTADA/DURATION OF STAY</span>
                                <span style={{ fontWeight: 'bold', fontSize: '10px', marginLeft: '5px' }}>{duration}</span>
                            </div>

                            {/* Full Name */}
                            <div style={{ marginBottom: '8px' }}>
                                <span style={{ color: '#0066CC', fontSize: '9px' }}>NOME COMPLETO/FULL NAME</span>
                                <span style={{ fontWeight: 'bold', fontSize: '10px', marginLeft: '5px' }}>{fullName}</span>
                            </div>

                            {/* Document and Nationality */}
                            <div style={{ display: 'flex', marginBottom: '8px' }}>
                                <div style={{ width: '50%' }}>
                                    <span style={{ color: '#0066CC', fontSize: '9px' }}>DOCUMENTO Nº/TRAVEL DOC. No</span>
                                    <span style={{ fontWeight: 'bold', fontSize: '10px', marginLeft: '5px' }}>{documentNumber}</span>
                                </div>
                                <div style={{ width: '60%' }}>
                                    <span style={{ color: '#0066CC', fontSize: '9px' }}>NACIONALIDADE/NATIONALITY</span>
                                    <span style={{ fontWeight: 'bold', fontSize: '10px', marginLeft: '5px' }}>{nationality}</span>
                                </div>
                            </div>

                            {/* Sex and DOB */}
                            <div style={{ display: 'flex', marginBottom: '8px' }}>
                                <div style={{ width: '20%' }}>
                                    <span style={{ color: '#0066CC', fontSize: '9px' }}>SEXO/SEX</span>
                                    <span style={{ fontWeight: 'bold', fontSize: '10px', marginLeft: '5px' }}>{sex}</span>
                                </div>
                                <div style={{ width: '80%' }}>
                                    <span style={{ color: '#0066CC', fontSize: '9px' }}>DATA DE NASCIMENTO/DATE OF BIRTH</span>
                                    <span style={{ fontWeight: 'bold', fontSize: '10px', marginLeft: '5px' }}>{dateOfBirth}</span>
                                </div>
                            </div>

                            {/* Issuing Authority */}
                            <div style={{ marginBottom: '8px' }}>
                                <span style={{ color: '#0066CC', fontSize: '9px' }}>AUTORIDADE EMISSORA/ISSUING AUTHORITY</span>
                                <span style={{ fontWeight: 'bold', fontSize: '10px', marginLeft: '5px' }}>{issuingAuthority}</span>
                            </div>

                            {/* Process Number */}
                            <div style={{ marginBottom: '8px' }}>
                                <span style={{ color: '#0066CC', fontSize: '9px' }}>PROCESSO Nº</span>
                                <span style={{ fontWeight: 'bold', fontSize: '10px', marginLeft: '5px' }}>{processNumber}</span>
                            </div>

                            {/* Custom Fields */}
                            {customFields && customFields.length > 0 && customFields.map((field, index) => (
                                <div key={index} style={{ marginBottom: '6px' }}>
                                    <span style={{ color: '#0066CC', fontSize: '9px' }}>{field.key.toUpperCase()}</span>
                                    <span style={{ fontWeight: 'bold', fontSize: '10px', marginLeft: '5px' }}>{field.value}</span>
                                </div>
                            ))}

                            {/* Federal Police */}
                            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                <span style={{ fontSize: '10px', fontWeight: 'bold' }}>POLÍCIA FEDERAL</span>
                            </div>
                        </div>
                    </div>
                </main>

                {/* ================= INSTRUCTIONS ================= */}
                <section className="instructions">

                    <div className="instruction-block">
                        <h3>VISA HOLDER:</h3>
                        <p>
                            It is advisable to print a copy of your e Visa and carry it with you during your trip. You will not be allowed to
                            board a flight or enter Brazilian territory unless you present your visa to the Airline and Border Control
                            Agent.
                        </p>
                    </div>

                    <div className="instruction-block">
                        <h3>AIRLINES AGENTS:</h3>
                        <p>
                            Airlines must carefully verify that the personal data on this electronic visa exactly matches the information
                            displayed on the official "gov.br" verification page accessible via QR code. Boarding passengers bound for
                            Brazil Without proper migratory documentation, including visas when required, constitutes an administrative
                            offense, subjecting airlines to fines per irregularity transported passenger.
                        </p>
                    </div>

                    <div className="verification-text">
                        <p>
                            To verify the authenticity of this visa, scan the QR Code or visit https://visa-haiti.serpro.gov.br/verify and
                            enter the following code:
                        </p>
                    </div>

                    <div className="verification-section">
                        <div className="verification-code">
                            GWZG.FQHL.6TCW.3PLF
                        </div>
                    </div>

                    <div className="qr-code-section">
                        <div className="qr-code-placeholder" style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ddd' }}>
                            {data.qrCode ? (
                                <img
                                    src={data.qrCode}
                                    alt="QR Code"
                                    style={{ width: '140px', height: '140px' }}
                                />
                            ) : (
                                <span style={{ fontSize: '12px', color: '#999' }}>QR CODE</span>
                            )}
                        </div>
                    </div>

                    <div className="contact-info">
                        <p>Should you have any questions, please contact us at consular.principal@itamaraty.gov.br.</p>
                    </div>

                </section>

            </div>
        </div>
    );
};

export default VisaTemplate;
