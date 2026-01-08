
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
        logoImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4RMKKKXbQaaVk_Ny8Ya5gLA5H1_WIDyTWcA&s',
        profileImage: 'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250',
      }}
      />
       {/* <TemplateAsImage data={data} /> */}
    </div>
  )
}

export default TemplateP
