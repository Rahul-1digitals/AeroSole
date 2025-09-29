import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './VideoFullscreen.scss';

function VideoFullscreen({ item, selectedSize, setSelectedSize, handleAddToBag, onClose }) {
  const navigate = useNavigate();
  const defaultSizes = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11'];

  const handleBackToEditor = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="video-fullscreen">
      <Navbar />
      
      {/* Background Video */}
      <div className="fullscreen-video-bg">
        <video
          key={item.video}
          muted
          loop
          playsInline
          autoPlay
          className="bg-video"
        >
          <source src={item.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content Overlay */}
      <div className="video-overlay">
        {/* Back to Editor - Top Left */}
        <button
          className="back-editor-fullscreen"
          onClick={handleBackToEditor}
          aria-label="Back to editor"
        >
          <span>←</span>
          <span>BACK TO EDITOR</span>
        </button>

        {/* Bottom Left - Share Design */}
        <div className="share-section">
          <div className="share-pill">
            <span>SHARE YOUR DESIGN</span>
          </div>
          
          <h1 className="pd-title" aria-live="polite">{item.title}</h1>
          
          <div className="pd-build">
            <span className="label">Custom Build:</span>
            <span className="value">{item.build}</span>
          </div>
        </div>

        {/* Bottom Right - Size & CTA */}
        <div className="size-cta-section">
          <p className="sizing-text">Update your sizing preferences</p>
          
          <div className="pd-size">
            <div className="size-select-wrap" role="listbox" tabIndex={0}>
              <span className="size-label">SIZE:</span>
              <span className={`size-value ${!selectedSize ? 'placeholder' : ''}`}>
                {selectedSize ? `US ${selectedSize}` : 'Select Size'}
              </span>
              <span className="chev">▼</span>
              <select
                id="size"
                aria-label="Select shoe size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="" disabled>Select Size</option>
                {(item.sizes || defaultSizes).map((s) => (
                  <option key={s} value={s}>US {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pd-cta">
            <div className="price" aria-label={`Price ${item.price}`}>{item.price}</div>
            <button 
              className="add-bag" 
              onClick={handleAddToBag} 
              aria-label="Add to bag"
              disabled={!selectedSize}
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoFullscreen;
