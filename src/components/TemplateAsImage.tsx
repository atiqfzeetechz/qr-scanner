import React, { useRef, useEffect, useState } from 'react'
import html2canvas from 'html2canvas'
import VisaTemplateNew from '../pages/VisaTemplateNew'
import { showInputDialog, showSuccess } from '../utils/sweetAlert'
import { useAxios } from '../hooks/useAxios'

interface TemplateAsImageProps {
  data: any
  showSaveButton?: boolean,
  showrightIcons?: boolean
}

const TemplateAsImage: React.FC<TemplateAsImageProps> = ({ data, showSaveButton = false, showrightIcons = true }) => {
  const templateRef = useRef<HTMLDivElement>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const { post } = useAxios()

  const generateImage = async () => {
    if (templateRef.current) {
      try {
        const canvas = await html2canvas(templateRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 768,
          height: 1024
        })

        const imageDataUrl = canvas.toDataURL('image/png')
        setImageUrl(imageDataUrl)
        setLoading(false)
      } catch (error) {
        console.error('Error generating image:', error)
        setLoading(false)
      }
    }
  }

  const saveTemplate = async () => {
    const { value: templateName } = await showInputDialog(
      'Save Template',
      'Template Name',
      'Brazil e-Visa v1'
    )

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
        dynamicData: data,
        customFields: data.customFields || [],
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
      }

      try {
        const res = await post('/admin/template/create', templateData)
        if (res.success) {
          showSuccess('Saved!', 'Template saved successfully!')
        }
      } catch (error) {
        console.error('Error saving template:', error)
      }
    }
  }

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      generateImage()
    }, 100)

    return () => clearTimeout(timer)
  }, [JSON.stringify(data)])

  return (
    <div>
      {/* Save Template Button - Only show when showSaveButton is true */}
      {showSaveButton && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={saveTemplate}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Save Template
          </button>
        </div>
      )}
      {/* Hidden template for image generation */}
      <div
        ref={templateRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '768px',
          backgroundColor: 'white'
        }}
      >
        <VisaTemplateNew data={data} showrightIcons={showrightIcons} />
      </div>

      {/* Display generated image */}
      <div style={{ width: '100%', textAlign: 'center' }}>
        {loading ? (
          <div style={{
            padding: '50px',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px'
          }}>
            <div>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #0066CC',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }}></div>
              Loading...
            </div>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Visa Template"
            style={{
              // maxWidth: '100%', 
              // height: 'auto',
              // border: '1px solid #ddd',
              // borderRadius: '8px',
              // boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          />
        ) : (
          <div style={{
            padding: '50px',
            color: '#dc3545',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            Failed to generate image. Please try again.
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default TemplateAsImage