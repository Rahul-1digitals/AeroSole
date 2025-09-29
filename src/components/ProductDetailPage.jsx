import React, { useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import VideoFullscreen from './VideoFullscreen';
import './ProductDetailPage.scss';

const defaultSizes = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11'];

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { designId } = useParams();
  const { state } = useLocation();

  const item = useMemo(() => {
    const fallback = {
      id: designId || 'design',
      title: (designId || 'Design').toUpperCase().replace(/-/g, ' '),
      build: 'Custom build configuration',
      price: '$70.00',
      images: [
        `/images/${designId || 'design'}/${designId || 'design'}_item1.png`,
        `/images/${designId || 'design'}/${designId || 'design'}_item2.png`,
        `/images/${designId || 'design'}/${designId || 'design'}_item3.png`,
      ],
      video: `/videos/${designId || 'design'}/${designId || 'design'}_video.mp4`,
      sizes: defaultSizes,
    };
    return { ...fallback, ...(state?.item || {}) };
  }, [state, designId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [showVideoFullscreen, setShowVideoFullscreen] = useState(false);

  const goPrev = () => setCurrentIndex((i) => (i - 1 + item.images.length) % item.images.length);
  const goNext = () => setCurrentIndex((i) => (i + 1) % item.images.length);

  const handleAddToBag = () => {
    if (!selectedSize) {
      alert('Please select a size before adding to bag.');
      return;
    }
    
    console.log('Add to bag:', { id: item.id, size: selectedSize, price: item.price });
    alert(`Added ${item.title} (Size ${selectedSize}) to bag.`);
  };

  const handleVideoClick = () => {
    setShowVideoFullscreen(true);
  };

  const handleCloseVideoFullscreen = () => {
    setShowVideoFullscreen(false);
  };

  // Get visible images for carousel (always show 3)
  const getVisibleImages = () => {
    const images = item.images;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const nextIndex = (currentIndex + 1) % images.length;
    
    return [
      { src: images[prevIndex], position: 'left' },
      { src: images[currentIndex], position: 'center' },
      { src: images[nextIndex], position: 'right' }
    ];
  };

  return (
    <div className="product-detail-page">
      <Navbar />

      {/* Decorative background text */}
      <div className="decor-text" aria-hidden="true">YOUR CREATION</div>

      <main className="pd-container" role="main">
        {/* V-Shape carousel */}
        <section className="pd-visual" aria-label={`${item.title} gallery`}>
          <button
            className="pd-nav pd-prev"
            onClick={goPrev}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className="v-carousel">
            {getVisibleImages().map((image, idx) => (
              <figure key={`${image.position}-${idx}`} className={`v-item ${image.position}`}>
                <img 
                  src={image.src} 
                  alt={`${item.title} view ${image.position}`} 
                  onError={(e) => {
                    console.log('Image failed to load:', image.src);
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzgwIiBoZWlnaHQ9IjI2MCIgdmlld0JveD0iMCAwIDM4MCAyNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzODAiIGhlaWdodD0iMjYwIiBmaWxsPSIjZjVmNWY1Ii8+Cjx0ZXh0IHg9IjE5MCIgeT0iMTMwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlByb2R1Y3QgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';
                  }}
                />
              </figure>
            ))}
          </div>

          <button
            className="pd-nav pd-next"
            onClick={goNext}
            aria-label="Next image"
          >
            ›
          </button>
        </section>

        {/* Left information block */}
        <aside className="pd-info" aria-label="Product configuration">
          <button
            className="back-editor"
            onClick={() => navigate('/design')}
            aria-label="Back to editor"
          >
            <span>←</span>
            <span>BACK TO EDITOR</span>
          </button>

          <h1 className="pd-title" aria-live="polite">{item.title}</h1>

          <div className="pd-build">
            <span className="label">Custom Build:</span>
            <span className="value">{item.build}</span>
          </div>

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
        </aside>

        {/* Center-bottom price & action */}
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

        {/* Right video */}
        <aside className="pd-video" aria-label="See your design in action">
          <h3>See your design in action:</h3>
          <div className="video-wrap" onClick={handleVideoClick} style={{ cursor: 'pointer' }}>
            <video
              key={item.video}
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={`${item.title} product video - Click to view fullscreen`}
              onMouseOver={(e) => {
                e.currentTarget.play().catch(() => {
                  console.log('Video play failed');
                });
              }}
              onFocus={(e) => {
                e.currentTarget.play().catch(() => {
                  console.log('Video play failed');
                });
              }}
              onMouseOut={(e) => e.currentTarget.pause()}
              onBlur={(e) => e.currentTarget.pause()}
              onLoadedMetadata={(e) => {
                // Just ensure video is ready, don't auto-play
                e.currentTarget.currentTime = 0;
              }}
              poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDE5MCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi0vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTAiIGhlaWdodD0iMjUwIiBmaWxsPSIjZjVmNWY1Ii8+Cjx0ZXh0IHg9Ijk1IiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q2xpY2sgdG8gVmlldyBGdWxsc2NyZWVuPC90ZXh0Pgo8Y2lyY2xlIGN4PSI5NSIgY3k9IjE0MCIgcj0iMjUiIGZpbGw9InJnYmEoMCwwLDAsMC4xKSIvPgo8c3ZnIHg9Ijg1IiB5PSIxMzAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOTk5Ij4KPHBvbHlnb24gcG9pbnRzPSI4LDUgMTksMTIgOCwxOSIvPgo8L3N2Zz4KPC9zdmc+"
              tabIndex={0}
              onError={(e) => {
                console.log('Video failed to load:', item.video);
                // Hide the video element and show a fallback
                e.currentTarget.style.display = 'none';
                const fallbackDiv = document.createElement('div');
                fallbackDiv.className = 'video-fallback';
                fallbackDiv.innerHTML = 'Video Not Available';
                fallbackDiv.style.cssText = `
                  width: 100%;
                  height: 100%;
                  background: #f5f5f5;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #999;
                  font-size: 14px;
                `;
                e.currentTarget.parentNode.appendChild(fallbackDiv);
              }}
            >
              <source src={item.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </aside>
      </main>

      {/* Video Fullscreen Modal */}
      {showVideoFullscreen && (
        <VideoFullscreen
          item={item}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          handleAddToBag={handleAddToBag}
          onClose={handleCloseVideoFullscreen}
        />
      )}
    </div>
  );
}