import React, { useEffect, useState } from "react";
import { showInputDialog, showSuccess } from '../utils/sweetAlert';
import "../styles/VisaTemplate.css";
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
        processNumber = '08228.042643/2023-72',
        isQrDataPage = false
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
        <div className="visa-document-container">
            {!isQrDataPage && (
                <button
                    onClick={saveTemplate}
                    className="visa-save-template-btn"
                >
                    Save Template
                </button>
            )}
            <div className="visa-document">

                {/* ================= HEADER ================= */}
                <header className="visa-document-header">
                    <div className="visa-coat-of-arms">
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

                    <div className="visa-header-text">
                        <h1>FEDERATIVE REPUBLIC OF BRAZIL</h1>
                        <h2>ELECTRONIC VISA</h2>
                    </div>
                </header>

                {/* ================= MAIN CONTENT ================= */}
                <main className="visa-document-content">

                    {/* LEFT COLUMN - Photo Section */}
                    <div className="visa-left-column">
                        <div className="visa-photo-placeholder">
                            <div className="visa-photo-frame">
                                {profileImage ? (
                                    <img
                                        src={imageurl(profileImage)}
                                        alt="Profile"
                                    />
                                ) : (
                                    <span>PHOTO</span>
                                )}
                            </div>
                        </div>

                        <div className="visa-coat-of-arms-small">
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
                    <div className="visa-right-column">
                        <div className="visa-info">
                            {/* First Row */}
                            <div className="visa-info-row">
                                <div className="visa-info-field-half">
                                    <span className="visa-field-label">BRASIL/BRAZIL</span>
                                    <span className="visa-field-sublabel">LOCAL DE EMISSÃO/PLACE OF ISSUING</span>
                                    <span className="visa-field-value">{placeOfIssuing}</span>
                                </div>
                                <div className="visa-info-field-half">
                                    <span className="visa-field-label">VISTO/VISA</span>
                                    <span className="visa-field-sublabel">Nº DO VISTO/VISA No</span>
                                    <span className="visa-field-value">{visaNumber}</span>
                                </div>
                            </div>

                            {/* Second Row */}
                            <div className="visa-info-row">
                                <div className="visa-info-field-half">
                                    <span className="visa-field-sublabel">No DE ENTRADAS/No. OF ENTRIES</span>
                                    <span className="visa-field-value">ÚNICA/SINGLE</span>
                                </div>
                                <div className="visa-info-field-half">
                                    <span className="visa-field-sublabel">DATA DE EMISSÃO/DATE OF ISSUE</span>
                                    <span className="visa-field-value">{issueDate}</span>
                                </div>
                            </div>

                            {/* Third Row */}
                            <div className="visa-info-row">
                                <div className="visa-info-field-half">
                                    <span className="visa-field-sublabel">TIPO DO VISTO/TYPE OF VISA</span>
                                    <span className="visa-field-value">VITEM XI</span>
                                </div>
                                <div className="visa-info-field-half">
                                    <span className="visa-field-sublabel">DATA DE VALIDADE/DATE OF EXPIRY</span>
                                    <span className="visa-field-value">{expiryDate}</span>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="visa-info-field-full">
                                <span className="visa-field-sublabel">PRAZO DE ESTADA/DURATION OF STAY</span>
                                <span className="visa-field-value">{duration}</span>
                            </div>

                            {/* Full Name */}
                            <div className="visa-info-field-full">
                                <span className="visa-field-sublabel">NOME COMPLETO/FULL NAME</span>
                                <span className="visa-field-value">{fullName}</span>
                            </div>

                            {/* Document and Nationality */}
                            <div className="visa-info-row">
                                <div className="visa-info-field-half">
                                    <span className="visa-field-sublabel">DOCUMENTO Nº/TRAVEL DOC. No</span>
                                    <span className="visa-field-value">{documentNumber}</span>
                                </div>
                                <div className="visa-info-field-half">
                                    <span className="visa-field-sublabel">NACIONALIDADE/NATIONALITY</span>
                                    <span className="visa-field-value">{nationality}</span>
                                </div>
                            </div>

                            {/* Sex and DOB */}
                            <div className="visa-info-row">
                                <div className="visa-info-field" style={{ width: '20%' }}>
                                    <span className="visa-field-sublabel">SEXO/SEX</span>
                                    <span className="visa-field-value">{sex}</span>
                                </div>
                                <div className="visa-info-field" style={{ width: '80%' }}>
                                    <span className="visa-field-sublabel">DATA DE NASCIMENTO/DATE OF BIRTH</span>
                                    <span className="visa-field-value">{dateOfBirth}</span>
                                </div>
                            </div>

                            {/* Issuing Authority */}
                            <div className="visa-info-field-full">
                                <span className="visa-field-sublabel">AUTORIDADE EMISSORA/ISSUING AUTHORITY</span>
                                <span className="visa-field-value">{issuingAuthority}</span>
                            </div>

                            {/* Process Number */}
                            <div className="visa-info-field-full">
                                <span className="visa-field-sublabel">PROCESSO Nº</span>
                                <span className="visa-field-value">{processNumber}</span>
                            </div>

                            {/* Custom Fields */}
                            {customFields && customFields.length > 0 && customFields.map((field, index) => (
                                <div key={index} className="visa-custom-field">
                                    <span className="visa-field-label">{field.key}</span>
                                    <span className="visa-field-value">{field.value}</span>
                                </div>
                            ))}

                            {/* Federal Police */}
                            <div className="visa-federal-police">
                                <span>POLÍCIA FEDERAL</span>
                            </div>
                        </div>
                    </div>
                </main>

                {/* ================= INSTRUCTIONS ================= */}
                <section className="visa-instructions">

                    <div className="visa-instruction-block">
                        <h3>VISA HOLDER:</h3>
                        <p>
                            It is advisable to print a copy of your e Visa and carry it with you during your trip. You will not be allowed to
                            board a flight or enter Brazilian territory unless you present your visa to the Airline and Border Control
                            Agent.
                        </p>
                    </div>

                    <div className="visa-instruction-block">
                        <h3>AIRLINES AGENTS:</h3>
                        <p>
                            Airlines must carefully verify that the personal data on this electronic visa exactly matches the information
                            displayed on the official "gov.br" verification page accessible via QR code. Boarding passengers bound for
                            Brazil Without proper migratory documentation, including visas when required, constitutes an administrative
                            offense, subjecting airlines to fines per irregularity transported passenger.
                        </p>
                    </div>

                    <div className="visa-verification-text">
                        <p>
                            To verify the authenticity of this visa, scan the QR Code or visit https://visa-haiti.serpro.gov.br/verify and
                            enter the following code:
                        </p>
                    </div>

                    <div className="visa-verification-section">
                        <div className="visa-verification-code">
                            GWZG.FQHL.6TCW.3PLF
                        </div>
                    </div>

                    <div className="visa-qr-code-section">
                        <div className="visa-qr-code-placeholder">
                            {data.qrCode ? (
                                <img
                                    src={data.qrCode}
                                    alt="QR Code"
                                />
                            ) : (
                                <span>QR CODE</span>
                            )}
                        </div>
                    </div>

                    <div className="visa-contact-info">
                        <p>Should you have any questions, please contact us at consular.principal@itamaraty.gov.br.</p>
                    </div>

                </section>

            </div>
        </div>
    );
};

export default VisaTemplate;