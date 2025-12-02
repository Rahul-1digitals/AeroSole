import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = ({ size = 'medium', overlay = false, message }) => {
  const sizeClass = `spinner-${size}`;
  
  if (overlay) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className={`loading-spinner ${sizeClass}`}>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p className="loading-message">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className={`loading-spinner ${sizeClass}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
