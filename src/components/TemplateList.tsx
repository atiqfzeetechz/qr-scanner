import React, { useState, useEffect } from 'react';
import { showConfirm, showSuccess, showError } from '../utils/sweetAlert';
import { useAxios } from '../hooks/useAxios';

interface Template {
  _id: string;
  templateName: string;
  templateType: string;
  dynamicData: any;
  customFields: Array<{ key: string; value: string }>;
  templateVersion: number;
  createdAt: string;
  updatedAt: string;
}

interface TemplateListProps {
  onSelectTemplate?: (template: Template) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const { get, delete: deleteTemplateApi } = useAxios()
  const [loading, setLoading] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await get('/admin/template/get')
      if (res.success) {
        setTemplates(res.data)
      }
      // Mock data for testing


    } catch (error) {
      showError('Error', 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string, name: string) => {
    const result = await showConfirm(
      'Delete Template',
      `Are you sure you want to delete "${name}"?`,
      'Delete',
      'Cancel'
    );

    if (result.isConfirmed) {
      try {
        await deleteTemplateApi(`/admin/template/delete/${id}`, { method: 'DELETE' });
        setTemplates(templates.filter(t => t._id !== id));
        showSuccess('Deleted!', 'Template deleted successfully');
      } catch (error) {
        showError('Error', 'Failed to delete template');
      }
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading templates...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Templates ({templates.length})</h2>
        <button
          onClick={fetchTemplates}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0066CC',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {templates.map((template) => (
          <div
            key={template._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#0066CC' }}>
                  {template.templateName}
                </h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                  Type: {template.templateType} | Version: {template.templateVersion}
                </p>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#999' }}>
                  Created: {new Date(template.createdAt).toLocaleDateString()}
                </p>

                {template.dynamicData.logoImage && (
                  <div style={{ marginTop: '8px' }}>
                    <img
                      src={template.dynamicData.logoImage}
                      alt="Logo"
                      style={{ width: '40px', height: '40px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {onSelectTemplate && (
                  <button
                    onClick={() => onSelectTemplate(template)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Use
                  </button>
                )}
                <button
                  onClick={() => deleteTemplate(template._id, template.templateName)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
              <strong>Fields:</strong> {template.dynamicData.fullName}, {template.dynamicData.visaNumber}, {template.dynamicData.nationality}
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No templates found
        </div>
      )}
    </div>
  );
};

export default TemplateList;