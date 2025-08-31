/**
 * Modern Admin Panel Card Component
 * Flexible, responsive card with loading states
 */

import React from 'react';
import './AdminCard.scss';

const AdminCard = ({ 
  children, 
  title, 
  subtitle,
  icon,
  loading = false,
  className = '',
  hover = true,
  padding = 'normal', // 'sm', 'normal', 'lg'
  actions,
  ...props 
}) => {
  if (loading) {
    return (
      <div className={`admin-card loading ${className}`} {...props}>
        <div className="card-skeleton">
          <div className="skeleton-header">
            <div className="skeleton-icon"></div>
            <div className="skeleton-text">
              <div className="skeleton-title"></div>
              <div className="skeleton-subtitle"></div>
            </div>
          </div>
          <div className="skeleton-content">
            <div className="skeleton-line long"></div>
            <div className="skeleton-line medium"></div>
            <div className="skeleton-line short"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`admin-card ${hover ? 'hoverable' : ''} ${className}`} 
      data-padding={padding}
      {...props}
    >
      {(title || subtitle || icon || actions) && (
        <div className="card-header">
          <div className="card-title-section">
            {icon && <div className="card-icon">{icon}</div>}
            <div className="card-titles">
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default AdminCard;
