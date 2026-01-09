import React from 'react'
import './VisaTemplate.css'
import { imageurl } from '../helper/urlChanger'

import QRCode from 'react-qr-code';



interface VisaTemplateProps {
  data: {
    placeOfIssuing?: string
    visaNumber?: string
    entries?: string
    issueDate?: string
    visaType?: string
    expiryDate?: string
    durationOfStay?: string
    fullName?: string
    documentNumber?: string
    sex?: string
    dateOfBirth?: string
    nationality?: string
    issuingAuthority?: string
    verificationCode?: string
    logoImage?: string
    profileImage?: string
    customFields?: Array<{ key: string, value: string }>
    processNumber?: string
    qrCode?: string | null,
    info: string
  }
}


const VisaTemplateNew: React.FC<VisaTemplateProps> = ({ data }) => {

  const {
    placeOfIssuing = 'PORTO PRÍNCIPE',
    visaNumber = '251127-510835',
    entries = 'ÚNICA/SINGLE',
    issueDate = '09 DEZ/DEC 2025',
    visaType = 'VITEM XI',
    expiryDate = '08 DEZ/DEC 2026',
    durationOfStay = '365 DIAS/DAYS',
    fullName = 'GREGOIRE NORMIL',
    documentNumber = 'R12732532',
    sex = 'M',
    dateOfBirth = '16 SET/SET 2005',
    nationality = 'HAITIANO',
    issuingAuthority = 'PORTO PRÍNCIPE EMB',
    verificationCode = 'GWZG.FQHL.6TCW.3PLF',
    logoImage,
    profileImage,
    customFields = [],
    processNumber = '08228.030381/2024-67',
    qrCode = null,
    info = "ESIDÊNCIA PRÉVIA - PORTARIAS INTERMINISTERIAIS MJSP/MRE Nº 38/2023 E 55/2025. PROCESSO Nº: 08228.030381/2024-67.CHAMANTE: MARC NORMIL. REGISTRO JUNTO À POLÍCIA FEDERAL DENTRO DE 90 (NOVENTA) DIAS DA PRIMEIRA ENTRADA NO PAÍS."

  } = data
  return (
    <div className="document-container">
      <div className="document">
        {/* Header Section */}
        <header className="document-header">
          <div className="coat-of-arms">
            {logoImage ? (
              <img src={imageurl(logoImage)} alt="Logo" style={{ height: '70px' }} />
            ) : (
              <img src="https://visahaitiser.wise-hustlers.tech/backend/uploads/logos/1767850960427-959495996.png" alt="Coat of Arms" />
            )}
          </div>
          <div className="header-text">
            <h1>FEDERATIVE REPUBLIC OF BRAZIL</h1>
            <h2>ELECTRONIC VISA</h2>
          </div>
        </header>

        {/* Main Content */}
        <main className="document-content">
          {/* Left Column */}
          <div className="left-column">
            <div className="photo-placeholder">
              {profileImage ? (
                <img className="photo-frame" src={imageurl(profileImage)} alt="Profile" />
              ) : (
                <img className="photo-frame" src="https://visahaitiser.wise-hustlers.tech/backend/uploads/logos/1767851113627-378589220.png" alt="Photo" />
              )}
            </div>
            <div className="belowimage">
              {logoImage ? (
                <img
                  className="iamgelogounderimage"
                  src={imageurl(logoImage)}
                  alt="Logo"
                />
              ) : (
                <img
                  className="iamgelogounderimage"
                  src="https://visahaitiser.wise-hustlers.tech/backend/uploads/logos/1767850960427-959495996.png"
                  alt="Logo"
                />
              )}
              <div className="belowimagetext">
                <p>GRÁTIS</p>
                <p className="belowimagetext2ndp">TEC 1.02.22.850.017</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            <div className="visa-info">
              <div className="info-row">
                <div className="info-group">
                  {/* Row 1 */}
                  <div className="eachrow">
                    <div className="child1">
                      <p className="infoheader">BRASIL/BRAZIL</p>
                    </div>
                    <div className="child2">
                      <p className="infoheader">VISTO/VISA</p>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="eachrow">
                    <div className="child1">
                      <p className="infosmallheader">LOCAL DE EMISSÃO/PLACE OF ISSUING</p>
                      <p className="infosmallabel">{placeOfIssuing}</p>
                    </div>
                    <div className="child2">
                      <p className="infosmallheader">Nº DO VISTO/VISA No</p>
                      <p className="infosmallabel">{visaNumber}</p>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="eachrow">
                    <div className="child1">
                      <p className="infosmallheader">Nº DE ENTRADAS/No. OF ENTRIES</p>
                      <p className="infosmallabel">{entries}</p>
                    </div>
                    <div className="child2">
                      <p className="infosmallheader">DATA DE EMISSÃO/DATE OF ISSUE</p>
                      <p className="infosmallabel">{issueDate}</p>
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div className="eachrow">
                    <div className="child1">
                      <p className="infosmallheader">TIPO DO VISTO/TYPE OF VISA</p>
                      <p className="infosmallabel">{visaType}</p>
                    </div>
                    <div className="child2">
                      <p className="infosmallheader">DATA DE VALIDADE/DATE OF EXPIRY</p>
                      <p className="infosmallabel">{expiryDate}</p>
                    </div>
                  </div>

                  {/* Row 5 */}
                  <div className="eachrow">
                    <div className="child1">
                      <p className="infosmallheader">PRAZO DE ESTADA/DURATION OF STAY</p>
                      <p className="infosmallabel">{durationOfStay}</p>
                    </div>
                  </div>

                  {/* Row 6 */}
                  <div className="eachrow">
                    <div className="child1">
                      <p className="infosmallheader">NOME COMPLETO/FULL NAME</p>
                      <p className="infosmallabel">{fullName}</p>
                    </div>
                  </div>

                  {/* Row 7 */}
                  <div className="eachrow">
                    <div className="child1">
                      <p className="infosmallheader">DOCUMENTO Nº/TRAVEL DOC. No</p>
                      <p className="infosmallabel">{documentNumber}</p>
                    </div>
                    <div className="child2 mt-2" style={{ marginRight: '25px' }}>
                      <p className="infosmallheader">EXO/SEX</p>
                      <p className="infosmallabel">{sex}</p>
                    </div>
                    <div className="child3 mt-2">
                      <p className="infosmallheader">DATA DE NASCIMENTO/DATE OF BIRTH</p>
                      <p className="infosmallabel">{dateOfBirth}</p>
                    </div>
                  </div>

                  {/* Row 8 */}
                  <div className="eachrow">
                    <div className="child1">
                      <p className="infosmallheader">NACIONALIDADE/NATIONALITY</p>
                      <p className="infosmallabel">{nationality}</p>
                    </div>
                    <div className="child2 mt-2" style={{ marginRight: '25px' }}>
                      <p className="infosmallheader" style={{ visibility: 'hidden' }}>EXO/SEX</p>
                      <p className="infosmallabel" style={{ visibility: 'hidden' }}>{sex}</p>
                    </div>
                    <div className="child2">
                      <p className="infosmallheader">AUTORIDADE EMISSORA/ISSUING AUTHORITY</p>
                      <p className="infosmallabel">{issuingAuthority}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stay-info">
                {info ? <p style={{
                  wordSpacing: "11.5px"
                }}>{info}</p> :
                  <p>RESIDÊNCIA &nbsp; PRÉVIA &nbsp;-&nbsp; PORTARIAS&nbsp; INTERMINISTERIAIS &nbsp;  MJSP/MRE &nbsp; Nº <br />
                    38/2023 E &nbsp; 55/2025. &nbsp; PROCESSO Nº: &nbsp;{processNumber}. <br />
                    CHAMANTE: &nbsp; MARC NORMIL. &nbsp;REGISTRO &nbsp; JUNTO &nbsp; À &nbsp; POLÍCIA &nbsp; FEDERAL
                    DENTRO &nbsp;DE &nbsp; 90 (NOVENTA)&nbsp; DIAS  &nbsp; DA&nbsp; PRIMEIRA&nbsp; ENTRADA &nbsp;NO &nbsp;PAÍS.</p>
                }
                {/* Dynamic Custom Fields */}
                {customFields && customFields.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    {customFields.map((field, index) => (
                      <p key={index} style={{ fontSize: '11px', marginBottom: '5px' }}>
                        <strong>{field.key}:</strong> {field.value}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Instructions Section */}
        <section className="instructions">
          <div className="instruction-block">
            <h3>VISA HOLDER:</h3>
            <p>It is <strong>advisable</strong> to print a copy of your e-Visa and carry it with you during your trip. You will not be
              allowed to board a flight or enter Brazilian territory unless you present your visa to the Airline and
              Border Control Agent.</p>
          </div>

          <div className="instruction-block">
            <h3>AIRLINES AGENTS:</h3>
            <p>Airlines must carefully verify that the personal data on this electronic visa exactly matches the
              information displayed on the official "gov.br" verification page accessible via QR code. Boarding passengers
              bound for Brazil without proper migratory documentation, including visas when required, constitutes an
              administrative offense, subjecting airlines to fines per irregularly transported passenger.</p>
          </div>

          <div className="verification-section">
            <p>To verify the authenticity of this visa, scan the QR Code or visit https://visa-haiti.serpro.gov.br/verify
              and enter the following code:</p>
            <div className="verification-code">{verificationCode}</div>
          </div>

          <div className="qr-code-section">
            <div className="qr-code-placeholder">
              {
                qrCode &&
                <QRCode value={qrCode} size={128} />
              }
            </div>
          </div>

          <div className="contact-info">
            <p>Should you have any questions, please contact us at consular.principal@itamaraty.gov.br.</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default VisaTemplateNew