import React, { useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
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
      mainImage: `/images/design1.png`, // Default fallback image
      sizes: defaultSizes,
    };
    return { ...fallback, ...(state?.item || {}) };
  }, [state, designId]);

  const [selectedSize, setSelectedSize] = useState('');

  const handleAddToBag = () => {
    if (!selectedSize) {
      alert('Please select a size before adding to bag.');
      return;
    }
    
    console.log('Add to bag:', { id: item.id, size: selectedSize, price: item.price });
    alert(`Added ${item.title} (Size ${selectedSize}) to bag.`);
  };

  return (
    <div className="product-detail-page">
      <Navbar />

      {/* Decorative background text */}
      <div className="decor-text" aria-hidden="true">YOUR CREATION</div>

      <main className="pd-container" role="main">
        {/* Single Product Image */}
        <section className="pd-visual" aria-label={`${item.title} image`}>
          <div className="single-image-container">
            <figure className="product-image">
              <img 
                src={item.mainImage} 
                alt={`${item.title} design`} 
                onError={(e) => {
                  console.log('Image failed to load:', item.mainImage);
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzgwIiBoZWlnaHQ9IjI2MCIgdmlld0JveD0iMCAwIDM4MCAyNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzODAiIGhlaWdodD0iMjYwIiBmaWxsPSIjZjVmNWY1Ii8+Cjx0ZXh0IHg9IjE5MCIgeT0iMTMwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlByb2R1Y3QgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';
                }}
              />
            </figure>
          </div>
        </section>

        {/* Left information block */}
        <aside className="pd-info" aria-label="Product configuration">
          <button
            className="back-editor"
            onClick={() => navigate('/design', { state: { fromProductDetail: true } })}
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

      </main>
    </div>
  );
}