import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import LoadingSpinner from './LoadingSpinner';
import { FaFilter, FaPalette, FaGem, FaRedo, FaUpload, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';
import { searchProducts } from '../services/api';
import './ShoeDesignPage.scss';

const ShoeDesignPage = () => {
  const [selectedDesign, setSelectedDesign] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const [variationStrength, setVariationStrength] = useState(50);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLeopardVariants, setShowLeopardVariants] = useState(() => {
    // Initialize from sessionStorage to persist across navigation
    const saved = sessionStorage.getItem('showLeopardVariants');
    return saved ? JSON.parse(saved) : false;
  });

  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [designText, setDesignText] = useState('');
  
  // State for dynamic designs that can be updated
  const [currentDesigns, setCurrentDesigns] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  // Refs for speech recognition
  const recognitionRef = useRef(null);
  const accumulatedTextRef = useRef('');

  // Memoize apiProducts to prevent infinite re-renders
  const apiProducts = useMemo(() => {
    return location.state?.products || [];
  }, [location.state?.products]);
  
  // Initialize designs only once on component mount
  useEffect(() => {
    if (!isInitialized) {
      let initialDesigns;
      
      // FIRST check apiProducts (from Edit Design navigation) - highest priority
      if (apiProducts.length > 0) {
        initialDesigns = apiProducts.map((product, index) => ({
          id: index + 1,
          name: `DESIGN ${index + 1}`,
          image: product.img || `/images/design${index + 1}.png`,
          leopardImage: product.img || `/images/design${index + 1}_lepoard.png`,
          price: product.price ? product.price.match(/\$[\d.]+/g)?.pop() || '$70' : '$70',
          title: `Design ${index + 1}`,
          description: product.short_description
        }));
        console.log('ShoeDesignPage - Using apiProducts from Edit Design:', initialDesigns);
      }
      
      // If no apiProducts, then check localStorage
      if (!initialDesigns) {
        const savedDesigns = localStorage.getItem('shoeDesigns');
        if (savedDesigns) {
          try {
            const parsedDesigns = JSON.parse(savedDesigns);
            // Validate that it's a proper array with design objects
            if (Array.isArray(parsedDesigns) && parsedDesigns.length > 0 && parsedDesigns[0].image) {
              initialDesigns = parsedDesigns;
              console.log('ShoeDesignPage - Restored designs from localStorage:', initialDesigns);
            }
          } catch (error) {
            console.log('Error parsing saved designs, will use fallback');
          }
        }
      }
      
      // Final fallback to static defaults
      if (!initialDesigns) {
        initialDesigns = [
          { id: 1, name: 'DESIGN 1', image: '/images/design1.png', leopardImage: '/images/design1_lepoard.png', price: '$70', title: 'Design 1', description: 'Classic design' },
          { id: 2, name: 'DESIGN 2', image: '/images/design2.png', leopardImage: '/images/design2_lepoard.png', price: '$70', title: 'Design 2', description: 'Classic design' },
          { id: 3, name: 'DESIGN 3', image: '/images/design3.png', leopardImage: '/images/design3_lepoard.png', price: '$70', title: 'Design 3', description: 'Classic design' },
          { id: 4, name: 'DESIGN 4', image: '/images/design4.png', leopardImage: '/images/design4_lepoard.png', price: '$70', title: 'Design 4', description: 'Classic design' }
        ];
        console.log('ShoeDesignPage - Using default designs:', initialDesigns);
      }
      
      setCurrentDesigns(initialDesigns);
      setIsInitialized(true);
    }
  }, [apiProducts, isInitialized]);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('showLeopardVariants', JSON.stringify(showLeopardVariants));
  }, [showLeopardVariants]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setSpeechSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        accumulatedTextRef.current = '';
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          accumulatedTextRef.current += finalTranscript;
        }
        
        // Update text area with live transcription
        setDesignText(accumulatedTextRef.current + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Keep the accumulated text in the text area (no API call)
        setDesignText(accumulatedTextRef.current);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Get current designs based on leopard variant state (memoized to prevent unnecessary re-renders)
  const designs = useMemo(() => {
    return currentDesigns.map(design => ({
      ...design,
      image: showLeopardVariants ? design.leopardImage : design.image
    }));
  }, [currentDesigns, showLeopardVariants]);

  const handleDesignSelect = (designId) => {
    setSelectedDesign(designId);
  };

  // Toggle microphone recording
  const handleMicrophoneToggle = () => {
    if (!speechSupported) {
      console.log('Speech recognition not supported');
      return;
    }

    if (isListening) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      // Start recording
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Error starting speech recognition:', error);
        }
      }
    }
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

  const handleGenerate = async () => {
    if (!designText.trim()) {
      alert('Please enter a design description or use the microphone');
      return;
    }

    setIsGenerating(true);
    setIsImageLoading(true);
    console.log('ShoeDesignPage - Starting generation, loading states set to true');

    try {
      console.log('Generating design with text:', designText);
      const apiResult = await searchProducts(designText);
      console.log('API result received:', apiResult);
      
      if (apiResult.success && apiResult.allProducts && apiResult.allProducts.length > 0) {
        // Update current designs with new API response images
        const updatedDesigns = apiResult.allProducts.map((product, index) => ({
          id: index + 1,
          name: `DESIGN ${index + 1}`,
          image: product.img || `/images/design${index + 1}.png`,
          leopardImage: product.img || `/images/design${index + 1}_lepoard.png`,
          price: product.price ? product.price.match(/\$[\d.]+/g)?.pop() || '$70' : '$70',
          title: `Design ${index + 1}`,
          description: product.short_description
        }));
        
        // Update the designs state to show new images
        setCurrentDesigns(updatedDesigns);
        console.log('Updated designs with new API images:', updatedDesigns);
        
        // Save to localStorage for persistence
        localStorage.setItem('shoeDesigns', JSON.stringify(updatedDesigns));
        console.log('ShoeDesignPage - Saved designs to localStorage:', updatedDesigns);
        
        // Clear the text field after successful generation
        setDesignText('');
        
        // Reset image loading after successful update
        setTimeout(() => {
          setIsImageLoading(false);
          console.log('ShoeDesignPage - Image loading reset to false after successful generation');
        }, 200);
      } else {
        alert('No products found for your search. Please try a different description.');
        setIsImageLoading(false);
      }
    } catch (error) {
      console.error('Error generating design:', error);
      alert('Error generating design. Please try again.');
      setIsImageLoading(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    // Reset to original default designs
    const defaultDesigns = [
      { id: 1, name: 'DESIGN 1', image: '/images/design1.png', leopardImage: '/images/design1_lepoard.png', price: '$70' },
      { id: 2, name: 'DESIGN 2', image: '/images/design2.png', leopardImage: '/images/design2_lepoard.png', price: '$70' },
      { id: 3, name: 'DESIGN 3', image: '/images/design3.png', leopardImage: '/images/design3_lepoard.png', price: '$70' },
      { id: 4, name: 'DESIGN 4', image: '/images/design4.png', leopardImage: '/images/design4_lepoard.png', price: '$70' }
    ];
    
    setCurrentDesigns(defaultDesigns);
    setShowLeopardVariants(false);
    setDesignText('');
    setIsImageLoading(false);
    setIsGenerating(false);
    
    // Clear localStorage when resetting to defaults
    localStorage.removeItem('shoeDesigns');
    console.log('ShoeDesignPage - Cleared localStorage and reset to default designs');
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
                      className={`carousel-slide ${selectedDesign === design.id ? 'active' : ''} ${isImageLoading ? 'loading' : ''}`}
                      onClick={() => handleDesignSelect(design.id)}
                    >
                      {isImageLoading ? (
                        <div className="loading-container">
                          <LoadingSpinner size="large" />
                        </div>
                      ) : (
                        <>
                          <div className="design-info">
                            <h3>{design.name}</h3>
                            <button
                              className="shop-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                const item = {
                                  id: `design${design.id}`,
                                  title: design.title || 'OLD SKOOL',
                                  build: design.description || (showLeopardVariants ? 'Leopard pop brown / true white' : 'Classic design / true white'),
                                  price: design.price,
                                  mainImage: design.image, // Pass the current displayed image
                                  description: design.description,
                                  sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11'],
                                };
                                navigate(`/product/design${design.id}`, { state: { item } });
                              }}
                              aria-label={`Shop ${design.name}`}
                            >
                              SHOP NOW FROM {design.price}
                            </button>
                          </div>
                          <div className="shoe-image">
                            <img 
                              src={design.image} 
                              alt={design.name}
                              onLoad={() => setIsImageLoading(false)}
                              onError={() => setIsImageLoading(false)}
                            />
                          </div>
                        </>
                      )}
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
              <button className="action-btn" title="Reset to Original" onClick={handleReset}>
                <FaRedo />
                <span>reset</span>
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <div className="footer-section bottom-left">
            <span className="section-label">Take your design even further</span>
            <div className="input-with-mic">
              <button 
                className={`mic-button ${isListening ? 'listening' : ''}`}
                onClick={handleMicrophoneToggle}
                title={isListening ? "Stop recording" : "Start recording"}
              >
                {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
              </button>
              <textarea 
                value={designText}
                onChange={(e) => setDesignText(e.target.value)}
                placeholder="Describe your design... (e.g., 'show me a formal shoe', 'black sneakers with white soles', 'waterproof boots for winter')"
                className="design-input"
                rows="2"
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
              
              <button 
                className="generate-btn" 
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner size="extra-small" />
                    <span style={{ marginLeft: '8px' }}>GENERATING...</span>
                  </>
                ) : (
                  'GENERATE'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoeDesignPage;