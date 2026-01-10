import React, { useEffect, useState } from 'react'
import './verifyauthenticity.css'
import { Check, ChevronDown, ChevronUp, ClipboardList, Search } from 'lucide-react'
import codeImage from '../../assets/code.png'
import applicanNumber from '../../assets/applicationNumber.png'
import { useParams } from 'react-router-dom'
import { decodeData, VerificationCodeToCode, VisaNumberToApplicationNumber } from '../../helper/encodeDecode'
import { useAxios } from '../../hooks/useAxios'
const VerifyAuthenticity = () => {
    const [closed, setClosed] = useState(false)
    const [showTooltip, setShowTooltip] = useState('')
    const [decodedData, setDecodedData] = useState({})
    const [formData, setFormData] = useState({
        applicationNumber: '',
        code: ''
    })

    const { fetch, post } = useAxios()

    const { data } = useParams()
    useEffect(() => {
        if (data) {
            const _data = decodeData(data)
            setDecodedData(_data)
            console.log(_data)
            if (_data) {
                const newFormData = { ...formData }
                if (_data.applicationNumber) {
                    console.log('here')
                    newFormData.applicationNumber = VisaNumberToApplicationNumber(_data.applicationNumber)
                }
                if (_data.code) {
                    newFormData.code = VerificationCodeToCode(_data.code)
                }
                setFormData(newFormData)
            }
        }
    }, [data])
    console.log(formData)

    const verifyAuthenticity = async () => {
        try {
            const res = await post('/admin/qr/verifyAuthenticity', formData)
        } catch (error) {
            console.log(error)
        }
    }

    const [languageOpen, setLanguageOpen] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState('English')
    const [selectedFlag, setSelectedFlag] = useState('https://flagcdn.com/w20/gb.png')

    const handleLanguageSelect = (language: string, flagUrl: string) => {
        setSelectedLanguage(language)
        setSelectedFlag(flagUrl)
        setLanguageOpen(false)
    }
    return (
        <div className='verifycontainer'>
            <div className="header">
                <div className="leftchild">
                    <img src="https://visa-haiti.serpro.gov.br/sci/pages/web/ui/assets/images/brasao-republica.jpg" alt="" />
                    <h3> Ministry of Foreign Affairs</h3>
                </div>
                <div className="rightchild">
                    <div className="language-selector" onClick={() => setLanguageOpen(!languageOpen)}>
                        <img src={selectedFlag} alt={selectedLanguage} className="flag-icon" />
                        <span>{selectedLanguage}</span>
                        <ChevronDown size={16} className={`dropdown-arrow ${languageOpen ? 'open' : ''}`} />
                        {languageOpen && (
                            <div className="language-dropdown">
                                <div className="language-option" onClick={(e) => { e.stopPropagation(); handleLanguageSelect('English', 'https://flagcdn.com/w20/gb.png'); }}>
                                    <img src="https://flagcdn.com/w20/gb.png" alt="English" className="flag-icon" />
                                    <span>English</span>
                                </div>
                                <div className="language-option" onClick={(e) => { e.stopPropagation(); handleLanguageSelect('Português (Brasil)', 'https://flagcdn.com/w20/br.png'); }}>
                                    <img src="https://flagcdn.com/w20/br.png" alt="Portuguese" className="flag-icon" />
                                    <span>Português (Brasil)</span>
                                </div>
                                <div className="language-option" onClick={(e) => { e.stopPropagation(); handleLanguageSelect('Français', 'https://flagcdn.com/w20/fr.png'); }}>
                                    <img src="https://flagcdn.com/w20/fr.png" alt="French" className="flag-icon" />
                                    <span>Français</span>
                                </div>
                                <div className="language-option" onClick={(e) => { e.stopPropagation(); handleLanguageSelect('Deutsch', 'https://flagcdn.com/w20/de.png'); }}>
                                    <img src="https://flagcdn.com/w20/de.png" alt="German" className="flag-icon" />
                                    <span>Deutsch</span>
                                </div>
                                <div className="language-option" onClick={(e) => { e.stopPropagation(); handleLanguageSelect('Español', 'https://flagcdn.com/w20/es.png'); }}>
                                    <img src="https://flagcdn.com/w20/es.png" alt="Spanish" className="flag-icon" />
                                    <span>Español</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="accessibility-controls">
                        <button className="accessibility-btn">A+</button>
                        <button className="accessibility-btn">A-</button>
                        <button className="accessibility-btn">C</button>
                    </div>
                </div>
            </div>
            <div className="herader2">
                <div className="buttons">
                    <div className="button">
                        <Check size={12.8} />
                        <p>Visa</p>
                    </div>
                    <div className="button">
                        <Check size={12.8} />
                        <p> Verify Authenticity</p>
                    </div>
                    <div className="button">
                        <Search size={12.8} />
                        <p>Check Status</p>
                    </div>
                    <div className="button">
                        <ClipboardList size={12.8} />
                        <p> Update Visa Request Form</p>
                    </div>
                </div>
            </div>
            <div className="herader3">
                <p>Authenticity Verification</p>
            </div>
            <div className="header4">
                <div className="child1" onClick={() => setClosed(!closed)}>
                    <div className='icon-container'>  {
                        closed ? <ChevronDown color='white' /> : <ChevronUp color='white' />}</div>
                    <p>Recovery Data</p>

                </div>
                <div className={`child2 ${closed ? 'closed' : 'open'}`}>
                    <div className="inputcontainer">
                        <div className="singleinput">
                            <div className="lable">
                                <label htmlFor="ApplicationNumber">Application Number  </label>
                                <p className='astrict'>* </p>
                                <div className='questioncontainer'
                                    onMouseEnter={() => setShowTooltip('application')}
                                    onMouseLeave={() => setShowTooltip('')}
                                >
                                    <p>?</p>
                                    {showTooltip === 'application' && (
                                        <div className="tooltip">

                                            <img src={applicanNumber} alt="Application Number example" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <input className='input' type="text" name='ApplicationNumber' value={formData.applicationNumber} />
                        </div>

                        <div className="singleinput">
                            <div className="lable">
                                <label htmlFor="Code">Code  </label>
                                <p className='astrict'>* </p>
                                <div className='questioncontainer'
                                    onMouseEnter={() => setShowTooltip('code')}
                                    onMouseLeave={() => setShowTooltip('')}
                                >
                                    <p>?</p>
                                    {showTooltip === 'code' && (
                                        <div className="tooltip">

                                            <img src={codeImage} alt="Code example" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <input className='input' name='code' type="text" value={formData.code} />
                        </div>
                    </div>
                    <div className='buttoncontainer'>
                        <div className='actionsbuttons'>
                            <button className='button returnbutton'>RETURN</button>
                            <button className='button' style={{
                                background: "#0066D0"
                            }}>VERIFY AUTHENTICITY</button>
                        </div>
                    </div>
                </div>
                {decodedData && JSON.stringify(decodedData)}
            </div>
        </div>
    )
}

export default VerifyAuthenticity
