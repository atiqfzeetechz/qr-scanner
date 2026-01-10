import React, { useEffect, useState } from 'react'
import './verifyauthenticity.css'
import { Check, ChevronDown, ChevronUp, ClipboardList, Search } from 'lucide-react'
import codeImage from '../../assets/code.png'
import applicanNumber from '../../assets/applicationNumber.png'
import { useParams } from 'react-router-dom'
import { decodeData } from '../../helper/encodeDecode'
const VerifyAuthenticity = () => {
    const [closed, setClosed] = useState(false)
    const [showTooltip, setShowTooltip] = useState('')
    const [decodedData,setDecodedData] = useState({})

    const {data}=useParams()
    useEffect(()=>{
        if(data){
            const _data = decodeData(data)
            setDecodedData(_data)
        }
    },[data])
    console.log(data)
    return (
        <div className='verifycontainer'>
            <div className="header">
                <div className="leftchild">
                    <img src="https://visa-haiti.serpro.gov.br/sci/pages/web/ui/assets/images/brasao-republica.jpg" alt="" />
                    <h3> Ministry of Foreign Affairs</h3>
                </div>
                <div className="leftchild">
                    <h3>refce</h3>
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
                            <input className='input' type="text" name='ApplicationNumber' />
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
                            <input className='input' name='code' type="text" />
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
  {decodedData  && JSON.stringify(decodedData)}
            </div>
        </div>
    )
}

export default VerifyAuthenticity
