/**
 * Modern Admin Panel Button Component
 * Flexible button with multiple variants and states
 */

import React from 'react';
import './AdminButton.scss';

const AdminButton = ({ 
  children,
  variant = 'primary', // 'primary', 'secondary', 'success', 'danger', 'warning', 'ghost', 'outline'
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left', // 'left', 'right', 'only'
  fullWidth = false,
  className = '',
  onClick,
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  const buttonClass = [
    'admin-btn',
    `admin-btn--${variant}`,
    `admin-btn--${size}`,
    fullWidth && 'admin-btn--full-width',
    loading && 'admin-btn--loading',
    disabled && 'admin-btn--disabled',
    iconPosition === 'only' && 'admin-btn--icon-only',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClass}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="admin-btn__spinner">
          <svg viewBox="0 0 24 24">
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none"
              strokeLinecap="round"
              strokeDasharray="32"
              strokeDashoffset="32"
            >
              <animate
                attributeName="stroke-dasharray"
                dur="2s"
                values="0 32;16 16;0 32;0 32"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                dur="2s"
                values="0;-16;-32;-32"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </span>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="admin-btn__icon admin-btn__icon--left">
          {icon}
        </span>
      )}
      
      {iconPosition !== 'only' && (
        <span className="admin-btn__text">
          {children}
        </span>
      )}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="admin-btn__icon admin-btn__icon--right">
          {icon}
        </span>
      )}
      
      {iconPosition === 'only' && !loading && icon && (
        <span className="admin-btn__icon">
          {icon}
        </span>
      )}
    </button>
  );
};

export default AdminButton;
