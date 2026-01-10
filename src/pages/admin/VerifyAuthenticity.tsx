import { useEffect, useState } from 'react'
import './verifyauthenticity.css'
import { Check, ChevronDown, ChevronUp, ClipboardList, Search, Menu } from 'lucide-react'
import codeImage from '../../assets/code.png'
import applicanNumber from '../../assets/applicationNumber.png'
import { useParams } from 'react-router-dom'
import { decodeData } from '../../helper/encodeDecode'
import { useAxios } from '../../hooks/useAxios'
import TemplateAsImage from '../../components/TemplateAsImage'
import handIcon from '../../assets/hand-icon.png'
import icon128 from '../../assets/icon128x128.jpg'
import accessPopup from '../../assets/access_popup.jpg'
const VerifyAuthenticity = () => {
    const [closed, setClosed] = useState(false)
    const [resultClosed, setResultClosed] = useState(false)
    const [showTooltip, setShowTooltip] = useState('')
    const [decodedData, setDecodedData] = useState({})
    const fullUrl = window.location.href;

    const [formData, setFormData] = useState({
        applicationNumber: '',
        code: ''
    })
    console.log(decodedData)
    const [resultData, setResultData] = useState(null)
    const [errors, setErrors] = useState({
        msg: ""
    })

    const { post } = useAxios()

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
                    newFormData.applicationNumber = _data.applicationNumber
                }
                if (_data.code) {
                    newFormData.code = _data.code
                }
                setFormData(newFormData)
            }
        }
    }, [data])
    console.log(formData)

    const verifyAuthenticityApiCall = async () => {
        try {
            setErrors({ msg: "" })
            const res = await post('/admin/qr/verifyAuthenticity', formData)
            if (res.success) {
                const data = res.data.data
                data.qrCode = fullUrl
                setResultData(data)
            }
            console.log(res)
        } catch (error: any) {
            setErrors({
                msg: error.response?.data?.message || error.message || "Document not found"
            })
            console.log(error)
        }
    }

    const [languageOpen, setLanguageOpen] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState('English')
    const [selectedFlag, setSelectedFlag] = useState('https://flagcdn.com/w20/gb.png')

    console.log(languageOpen, selectedLanguage, selectedFlag)

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLanguageSelect = (language: string, flagUrl: string) => {
        setSelectedLanguage(language)
        setSelectedFlag(flagUrl)
        setLanguageOpen(false)
    }
    console.log(handleLanguageSelect)
    return (
        <div className='verifycontainer'>
            {/* Fixed Icons */}
            <div className="fixed-icons">
                <div className="fixed-icon hand-icon">
                    <img src={handIcon} alt="Hand Icon" />
                    <div className="popup-image">
                        <img src={accessPopup} alt="Access Popup" />
                    </div>
                </div>
                <div className="fixed-icon bottom-icon">
                    <img src={icon128} alt="Icon" />
                </div>
            </div>
            <div className="header">
                <div className="leftchild">
                    <img src="https://visa-haiti.serpro.gov.br/sci/pages/web/ui/assets/images/brasao-republica.jpg" alt="" />
                    <h3> Ministry of Foreign Affairs</h3>
                </div>
                {/* <div className="rightchild">
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
                </div> */}
            </div>
            <div className="herader2">
                <div className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <Menu size={20} color="white" />
                </div>
                <div className={`buttons ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <div className="button">
                        <Check size={16} />
                        <p>VISA</p>
                    </div>
                    <div className="button">
                        <Check size={16} />
                        <p>VERIFY AUTHENTICITY</p>
                    </div>
                    <div className="button">
                        <Search size={16} />
                        <p>CHECK STATUS</p>
                    </div>
                    <div className="button">
                        <ClipboardList size={16} />
                        <p>UPDATE VISA REQUEST FORM</p>
                    </div>
                </div>
            </div>
            <div className="herader3">
                <p>Authenticity Verification</p>
            </div>
            {errors.msg &&
                <p className='verifyerror'>
                    {errors.msg}
                </p>
            }
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
                            <input className='input' type="text" name='ApplicationNumber'
                                onChange={(e) => setFormData({ ...formData, applicationNumber: e.target.value })}
                                value={formData.applicationNumber} />
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
                            <input className='input' name='code' type="text"
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                value={formData.code} />
                        </div>
                    </div>
                    <div className='buttoncontainer'>
                        <div className='actionsbuttons'>
                            <button className='button returnbutton'>RETURN</button>
                            <button className='button'
                                onClick={verifyAuthenticityApiCall}
                                style={{
                                    background: "#0066D0"
                                }}>VERIFY AUTHENTICITY</button>
                        </div>
                    </div>
                </div>

            </div>
            {resultData && Object.keys(resultData).length > 0 && (
                <div className="header4">
                    <div className="child1" onClick={() => setResultClosed(!resultClosed)}>
                        <div className='icon-container'>{
                            resultClosed ? <ChevronDown color='white' /> : <ChevronUp color='white' />}</div>
                        <p>Search Result</p>
                    </div>
                    <div className={`child2 ${resultClosed ? 'closed' : 'open'}`}>
                        <div className='searchResult'>
                            <p className="resulth1">Situation</p>
                            <p className="resulth2">Válido</p>
                        </div>
                    </div>
                    <div className='actual-data' style={{
                        maxWidth: "80vw",
                        margin: 'auto',
                        marginTop: "30px"
                    }}>
                        <TemplateAsImage data={resultData} />
                    </div>
                </div>
            )}

        </div>
    )
}

export default VerifyAuthenticity
