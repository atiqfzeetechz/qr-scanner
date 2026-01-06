import React from 'react';
import TemplateList from '../components/TemplateList';

const TemplatesPage: React.FC = () => {
  const handleSelectTemplate = (template: any) => {
    console.log('Selected template:', template);
    // You can navigate to edit page or load template data
    // Example: navigate(`/edit-template/${template._id}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <TemplateList onSelectTemplate={handleSelectTemplate} />
      </div>
    </div>
  );
};

export default TemplatesPage;