import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Loader = () => {
    const { t } = useLanguage();
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem',
            gap: '1rem'
        }}>
            <div className="spinner" style={{
                width: '40px',
                height: '40px',
                border: '4px solid var(--glass-border)',
                borderTopColor: 'var(--primary-color)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: 'var(--text-muted)' }}>{t('loading')}</p>
            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Loader;
