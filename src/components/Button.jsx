import React from 'react';

const Button = ({ children, variant = 'primary', onClick, className = '', ...props }) => {
    const baseStyle = {
        padding: '0.75rem 1.5rem',
        borderRadius: 'var(--radius-sm)',
        fontWeight: '600',
        fontSize: '1rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        transition: 'var(--transition)'
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--primary-color)',
            color: '#fff',
        },
        outline: {
            backgroundColor: 'transparent',
            border: '1px solid var(--primary-color)',
            color: 'var(--primary-color)',
        },
        glass: {
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-main)',
        }
    };

    const currentStyle = { ...baseStyle, ...variants[variant] };

    return (
        <button
            style={currentStyle}
            onClick={onClick}
            className={`custom-button ${className}`}
            onMouseOver={(e) => {
                if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
                if (variant === 'outline') {
                    e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                    e.currentTarget.style.color = '#fff';
                }
            }}
            onMouseOut={(e) => {
                if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                if (variant === 'outline') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--primary-color)';
                }
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
