// @ts-nocheck
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import VisaTemplate from '../components/VisaTemplate';

const VisaView = () => {
  const [visaData, setVisaData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const encodedData = urlParams.get('data');
    
    if (encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData));
        setVisaData(decodedData);
      } catch (error) {
        console.error('Error decoding visa data:', error);
      }
    }
  }, [location]);

  if (!visaData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading visa information...
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <VisaTemplate data={visaData} />
      </div>
    </div>
  );
};

export default VisaView;