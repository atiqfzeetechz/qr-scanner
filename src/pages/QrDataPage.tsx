import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { decodeData } from '../helper/encodeDecode'
import TemplateAsImage from '../components/TemplateAsImage'
import { useAxios } from '../hooks/useAxios'
import GeetestPuzzleCaptcha from '../components/GeeTestCaptcha'
import { useQRCodeView } from '../hooks/useQRCodeView'

const QrDataPage = () => {
    const { data } = useParams()
    const { get } = useAxios()
    const [dec, setDec] = React.useState<any>(null)
    const [qrData, setQrData] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false)

     const {  display } = useQRCodeView({
       width: 200,
       height: 200,
       margin: 10,
     });
    // useEffect(() => {
    //     get('/geetest/register').then((res) => console.log(res)).catch(error => console.log(error))
    // },[])


    useEffect(() => {
        if (data) {
            const decoded = decodeData(data)
            display(decoded._id)
            setDec(decoded)

            // Fetch QR data
            get(`/admin/qr/get/${decoded._id}`)
                .then((res: any) => {
                    if (res.success) {
                        setQrData(res.data)

                        // If QR data has templateId, fetch template
                        if (res.data.templateId) {
                            return get(`/admin/template/get/${res.data.templateId}`)
                        }
                    }
                })
                .then((templateRes: any) => {
                    console.log({ templateRes })
                    setLoading(false)
                })
                .catch((err: any) => {
                    console.log('Error fetching data:', err)
                    setLoading(false)
                })
        }
    }, [data])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!dec || !qrData) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Data Not Found</h2>
                    <p className="text-gray-600">Unable to load QR code data</p>
                </div>
            </div>
        )
    }

    // Check if QR is inactive
    if (qrData.status !== "active") {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Qr Code</h2>
                    <p className="text-gray-600">This QR code is no longer active</p>
                </div>
            </div>
        )
    }

    // Get the visa data from QR data
    let visaData = {}

    try {
        // Handle different data formats
        if (typeof qrData.data === 'string') {
            const parsed = JSON.parse(qrData.data)
            visaData = parsed.data || parsed
        } else if (typeof qrData.data === 'object') {
            visaData = qrData.data.data || qrData.data
            visaData = { ...visaData, profileImage: qrData.data.userImage }
        }
    } catch (error) {
        console.error('Error parsing QR data:', error)
        visaData = qrData.data || {}
    }

    // Add isQrDataPage prop to hide save template button
    const templateProps = {
        ...visaData,
        isQrDataPage: true
    }

    const handleCaptchaSuccess = () => {
        setIsCaptchaVerified(true)
    }

    
    return (
        <>
            {isCaptchaVerified ? <div className="min-h-screen bg-gray-100 p-2">

                <div className="max-w-4xl mx-auto">
                    {/* Template Display */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden  maintempl" style={{
                      
                    }}>
                        <TemplateAsImage data={templateProps} />
                    </div>
                </div>
            </div> :

                <div style={{
                    display: "grid",
                    placeItems: "center",
                    height: "100vh",
                    width: "100vw",
                    background: "rgba(0,0,0,0.5)"
                }}>
                    <GeetestPuzzleCaptcha onSuccess={handleCaptchaSuccess} onError={(error) => {
                        console.log(error)
                    }} />

                </div>
            }



        </>
    )
}

export default QrDataPage
