import React from 'react'
import VisaTemplate from './VisaTemplateNew'
import TemplateAsImage from '../components/TemplateAsImage'

const TemplateP = () => {
  return (
    <div>
      <TemplateAsImage
      data={{
        fullName: 'John Doe',
        documentNumber: '123456789',
        nationality: 'US',
        visaNumber: 'ABC123',
        expiryDate: '2023-12-31',
        sex: 'M',
        dateOfBirth: '1990-01-01',
        placeOfIssuing: 'New York',
        issueDate: '2022-01-01',
        logoImage: 'https://www.imgonline.com.ua/examples/qr-code-blue.png',
        profileImage: 'https://www.imgonline.com.ua/examples/qr-code-blue.png',
      }}
      />
       {/* <TemplateAsImage data={data} /> */}
    </div>
  )
}

export default TemplateP
