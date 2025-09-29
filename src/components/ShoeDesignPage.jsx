import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { FaFilter, FaPalette, FaGem, FaRedo, FaUpload, FaMicrophone } from 'react-icons/fa';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';
import './ShoeDesignPage.scss';

const ShoeDesignPage = () => {
  const [selectedDesign, setSelectedDesign] = useState(1);
  const navigate = useNavigate();
  const [variationStrength, setVariationStrength] = useState(50);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLeopardVariants, setShowLeopardVariants] = useState(false);

  const baseDesigns = [
    { id: 1, name: 'DESIGN 1', image: '/images/design1.png', leopardImage: '/images/design1_lepoard.png', price: '$70' },
    { id: 2, name: 'DESIGN 2', image: '/images/design2.png', leopardImage: '/images/design2_lepoard.png', price: '$70' },
    { id: 3, name: 'DESIGN 3', image: '/images/design3.png', leopardImage: '/images/design3_lepoard.png', price: '$70' },
    { id: 4, name: 'DESIGN 4', image: '/images/design4.png', leopardImage: '/images/design4_lepoard.png', price: '$70' }
  ];

  // Get current designs based on leopard variant state
  const designs = baseDesigns.map(design => ({
    ...design,
    image: showLeopardVariants ? design.leopardImage : design.image
  }));

  const handleDesignSelect = (designId) => {
    setSelectedDesign(designId);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    console.log('Generating design with:', { selectedDesign, variationStrength, uploadedImage });
    // Toggle between regular and leopard variants
    setShowLeopardVariants(!showLeopardVariants);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(Math.max(0, currentSlide - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(Math.min(Math.ceil(designs.length / 2) - 1, currentSlide + 1));
  };

  return (
    <div className="shoe-design-page">
      {/* Header Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <div className="design-main-content">
        {/* Style Selector */}
        <div className="style-selector">
          <span className="style-label">STYLE SELECTED:</span>
          <select className="style-dropdown">
            <option>OLD SKOOL</option>
            <option>AUTHENTIC</option>
            <option>ERA</option>
            <option>SK8-HI</option>
          </select>
        </div>

        {/* Main Heading */}
        <h1 className="main-heading">EDIT YOUR DESIGN</h1>

        {/* User Creations & Community Links */}
        <div className="top-links">
          <button className="link-btn">YOUR CREATIONS</button>
          <button className="link-btn">COMMUNITY CREATIONS</button>
        </div>

        {/* Carousel Section - Two items per view */}
        <div className="carousel-sections">
          <button 
            className="carousel-nav prev"
            onClick={handlePrevSlide}
            disabled={currentSlide === 0}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          
          <button 
            className="carousel-nav next"
            onClick={handleNextSlide}
            disabled={currentSlide === Math.ceil(designs.length / 2) - 1}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>

          <div className="carousel-viewport">
            <div 
              className="carousel-track"
              style={{ 
                transform: `translateX(-${currentSlide * 100}%)`
              }}
            >
              {/* Group designs in pairs */}
              {[0, 2].map((startIndex) => (
                <div key={startIndex} className="carousel-group">
                  {designs.slice(startIndex, startIndex + 2).map((design) => (
                    <div 
                      key={design.id}
                      className={`carousel-slide ${selectedDesign === design.id ? 'active' : ''}`}
                      onClick={() => handleDesignSelect(design.id)}
                    >
                      <div className="design-info">
                        <h3>{design.name}</h3>
                        <button
                          className="shop-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            const key = `design${design.id}`;
                            const item = {
                              id: key,
                              title: 'OLD SKOOL',
                              build: 'Leopard pop brown / true white',
                              price: design.price,
                              images: [
                                `/images/${key}/${key}_item1.png`,
                                `/images/${key}/${key}_item2.png`,
                                `/images/${key}/${key}_item3.png`,
                              ],
                              video: `/videos/${key}/${key}_video.mp4`,
                              sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11'],
                            };
                            navigate(`/product/${key}`, { state: { item } });
                          }}
                          aria-label={`Shop ${design.name}`}
                        >
                          SHOP NOW FROM {design.price}
                        </button>
                      </div>
                      <div className="shoe-image">
                        <img src={design.image} alt={design.name} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="footer-controls-bar">
        <div className="footer-top-row">
          <div className="footer-section top-left">
            <div className="top-labels-row">
              <span className="section-label">See more variations from:</span>
              <div className="variation-labels">
                <span className="variation-label">Subtle variation</span>
                <span className="variation-label">Strong variation</span>
              </div>
            </div>
            <div className="design-row">
              <div className="design-buttons">
                {designs.map((design) => (
                  <button
                    key={design.id}
                    className={`design-btn ${selectedDesign === design.id ? 'active' : ''}`}
                    onClick={() => handleDesignSelect(design.id)}
                  >
                    {design.name}
                  </button>
                ))}
              </div>
              <div className="variation-controls">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={variationStrength}
                  onChange={(e) => setVariationStrength(e.target.value)}
                  className="variation-slider"
                />
              </div>
            </div>
          </div>

          <div className="footer-section top-right">
            <span className="section-label">Editing Options</span>
            <div className="action-buttons">
              <button className="action-btn" title="Filter">
                <FaFilter />
                <span>filters</span>
              </button>
              <button className="action-btn" title="Color Pick">
                <FaPalette />
                <span>colour pick</span>
              </button>
              <button className="action-btn" title="Materials">
                <FaGem />
                <span>materials</span>
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <div className="footer-section bottom-left">
            <span className="section-label">Take your design even further</span>
            <div className="input-with-mic">
              <FaMicrophone className="mic-icon" />
              <input 
                type="text" 
                placeholder="insert example here"
                className="design-input"
              />
            </div>
          </div>

          <div className="footer-section bottom-right">
            <span className="section-label">Add an Image to your design</span>
            <div className="upload-generate-row">
              <div className="upload-area">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="upload-input"
                />
                <label htmlFor="image-upload" className="upload-label">
                  <FaUpload />
                  <span>Drop an image here</span>
                </label>
              </div>
              
              <button className="generate-btn" onClick={handleGenerate}>
                GENERATE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoeDesignPage;