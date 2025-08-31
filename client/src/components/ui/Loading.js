/**
 * Baybar Kurumsal Tanıtım Sitesi - Loading Bileşeni
 * Yükleme durumları için animasyonlu gösterge
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React from 'react';
import './Loading.scss';

const Loading = ({ 
  size = 'medium', 
  variant = 'spinner', 
  text = 'Yükleniyor...', 
  fullScreen = false,
  overlay = false,
  className = '' 
}) => {
  // Spinner bileşeni
  const Spinner = () => (
    <div className={`loading__spinner loading__spinner--${size}`}>
      <div className="loading__spinner-circle"></div>
      <div className="loading__spinner-circle"></div>
      <div className="loading__spinner-circle"></div>
    </div>
  );

  // Dots bileşeni
  const Dots = () => (
    <div className={`loading__dots loading__dots--${size}`}>
      <div className="loading__dot"></div>
      <div className="loading__dot"></div>
      <div className="loading__dot"></div>
    </div>
  );

  // Pulse bileşeni
  const Pulse = () => (
    <div className={`loading__pulse loading__pulse--${size}`}>
      <div className="loading__pulse-circle"></div>
    </div>
  );

  // Bars bileşeni
  const Bars = () => (
    <div className={`loading__bars loading__bars--${size}`}>
      <div className="loading__bar"></div>
      <div className="loading__bar"></div>
      <div className="loading__bar"></div>
      <div className="loading__bar"></div>
      <div className="loading__bar"></div>
    </div>
  );

  // Logo spinner bileşeni
  const LogoSpinner = () => (
    <div className={`loading__logo loading__logo--${size}`}>
      <div className="loading__logo-container">
        <svg 
          className="loading__logo-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 2L2 7L12 12L22 7L12 2Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M2 17L12 22L22 17" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M2 12L12 17L22 12" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );

  // Variant'a göre bileşen seç
  const renderLoadingComponent = () => {
    switch (variant) {
      case 'dots':
        return <Dots />;
      case 'pulse':
        return <Pulse />;
      case 'bars':
        return <Bars />;
      case 'logo':
        return <LogoSpinner />;
      default:
        return <Spinner />;
    }
  };

  // Ana container class'ları
  const containerClasses = [
    'loading',
    `loading--${variant}`,
    `loading--${size}`,
    fullScreen && 'loading--fullscreen',
    overlay && 'loading--overlay',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      {overlay && <div className="loading__backdrop"></div>}
      
      <div className="loading__content">
        {renderLoadingComponent()}
        
        {text && (
          <div className="loading__text">
            {text}
          </div>
        )}
      </div>
      
      {/* Screen reader için */}
      <span className="sr-only">{text}</span>
    </div>
  );
};

// Skeleton Loading bileşeni
export const SkeletonLoader = ({ 
  lines = 3, 
  height = '20px', 
  className = '',
  animated = true 
}) => {
  return (
    <div className={`skeleton ${animated ? 'skeleton--animated' : ''} ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <div 
          key={index}
          className="skeleton__line"
          style={{ 
            height,
            width: index === lines - 1 ? '70%' : '100%'
          }}
        ></div>
      ))}
    </div>
  );
};

// Button Loading bileşeni
export const ButtonLoading = ({ size = 'small', className = '' }) => {
  return (
    <div className={`button-loading button-loading--${size} ${className}`}>
      <div className="button-loading__spinner">
        <div className="button-loading__circle"></div>
      </div>
    </div>
  );
};

// Progress Bar bileşeni
export const ProgressBar = ({ 
  progress = 0, 
  showPercentage = true, 
  className = '',
  animated = true 
}) => {
  return (
    <div className={`progress-bar ${animated ? 'progress-bar--animated' : ''} ${className}`}>
      <div className="progress-bar__track">
        <div 
          className="progress-bar__fill"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        ></div>
      </div>
      
      {showPercentage && (
        <div className="progress-bar__percentage">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default Loading;