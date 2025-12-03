import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaTimes, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import EditDesignLoading from './EditDesignLoading';
import LoadingSpinner from './LoadingSpinner';
import { searchProducts } from '../services/api';
import './CustomShoeResult.scss';

const CustomShoeResult = ({ onClose, onBack, apiResult }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [showEditLoading, setShowEditLoading] = useState(false);
  const [apiProcessed, setApiProcessed] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [noProductsFromVoice, setNoProductsFromVoice] = useState(false);
  const [hasVoiceSearch, setHasVoiceSearch] = useState(false);
  const [currentEntities, setCurrentEntities] = useState([]);
  
  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [interimText, setInterimText] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  
  // Refs for speech recognition
  const recognitionRef = useRef(null);
  const accumulatedTextRef = useRef('');

  // Flags for new API response structure
  const productCount = apiResult?.result?.product_count;
  const productsArray = apiResult?.result?.products || [];
  const firstApiProduct = productsArray[0];
  const zeroProductsFromApi = !hasVoiceSearch && apiResult && apiResult.success && (productCount === 0 || productsArray.length === 0);
  const showZeroProducts = zeroProductsFromApi || noProductsFromVoice;
  const lowConfidenceFirstProduct = apiResult && apiResult.success && firstApiProduct &&
    typeof firstApiProduct.confidence === 'number' && firstApiProduct.confidence < 50;

  // Determine which product to show in the footer (initial API result vs latest voice search)
  const currentFooterProduct = useMemo(() => {
    // If we have done at least one in-page voice search, prefer products from that search
    if (hasVoiceSearch && allProducts && allProducts.length > 0) {
      return allProducts[0];
    }

    // Fallback to the initial apiResult
    if (firstApiProduct) {
      return firstApiProduct;
    }

    if (apiResult && apiResult.product) {
      return apiResult.product;
    }

    return null;
  }, [hasVoiceSearch, allProducts, firstApiProduct, apiResult]);

  const steps = [
    {
      text: "skate shoes in a nineties style with a leopard pattern",
      image: "/images/custom-shoe-leopard.png",
      features: ["Skateboard shoes", "Nineties style", "Leopard pattern"]
    },
    {
      text: "show me the black and white version",
      image: "/images/custom-shoe-leopard-black-white.png",
      features: ["Skateboard shoes", "Nineties style", "Leopard pattern", "Black & White"]
    },
    {
      text: "change the color theme to warm tones",
      image: "/images/custom-shoe-leopard-warm.png",
      features: ["Skateboard shoes", "Nineties style", "Leopard pattern", "Black & White", "Warm Tones"]
    }
  ];

  useEffect(() => {
    // Add a small delay before fade in to prevent flickering
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Small delay for smooth appearance
    
    return () => clearTimeout(timer);
  }, []);

  // Set initial content - show user query immediately if available
  useEffect(() => {
    if (apiResult && apiResult.user_query) {
      // Show user's speech text immediately
      setDisplayedText(apiResult.user_query);
    } else if (!apiResult) {
      // Default content if no API result
      setCurrentImage(steps[0].image);
      setDisplayedText(steps[0].text);
      setIsImageLoading(false);
      setIsApiLoading(false);
    }
  }, [apiResult]);

  // Optimized API result processing (for initial page load with existing apiResult)
  useEffect(() => {
    if (!apiResult || apiProcessed) return;
    
    // Only process if this is an initial page load, not from speech recognition
    if (!isListening && !isImageLoading && !isApiLoading) {
      setIsApiLoading(true);
      console.log('CustomShoeResult - API loading set to true for initial processing');
    }
    
    if (apiResult.success) {
      // Handle new API response structure
      if (apiResult.result?.products) {
        const products = apiResult.result.products;
        const firstProduct = products[0];
        
        // Set image and text from first product
        if (firstProduct) {
          if (!apiResult.user_query) {
            setDisplayedText(firstProduct.short_description || firstProduct.title || steps[0].text);
          }
          if (firstProduct.img) {
            setIsImageLoading(true);
            console.log('CustomShoeResult - Image loading set to true for new image');
            // Use setTimeout to ensure loading state is rendered before setting image
            setTimeout(() => {
              setCurrentImage(firstProduct.img.trim() || steps[0].image);
              console.log('CustomShoeResult - Image URL set after loading state');
            }, 50);
            // Reset image loading after showing the loading animation
            setTimeout(() => {
              setIsImageLoading(false);
              console.log('CustomShoeResult - Image loading reset to false');
            }, 1200);
          } else {
            // No image in API result, use default and don't show loading
            setCurrentImage(steps[0].image);
            setIsImageLoading(false);
            console.log('CustomShoeResult - No image in API result, using default');
          }
        }
        
        // Store products immediately
        setAllProducts(products);
        
        // Initialize entities with first product's entities (only on initial load)
        if (firstProduct && firstProduct.entities && Array.isArray(firstProduct.entities) && currentEntities.length === 0) {
          // Entities are now strings, not objects
          const initialEntities = firstProduct.entities; // Direct array of strings
          setCurrentEntities(initialEntities);
          console.log('CustomShoeResult - Initialized entities:', initialEntities);
        }
        
      } else if (apiResult.product) {
        // Handle old API response structure
        const product = apiResult.product;
        if (!apiResult.user_query) {
          setDisplayedText(product.short_description || product.title || steps[0].text);
        }
        if (product.img?.trim()) {
          setIsImageLoading(true);
          console.log('CustomShoeResult - Image loading set to true for old API structure');
          // Use setTimeout to ensure loading state is rendered before setting image
          setTimeout(() => {
            setCurrentImage(product.img.trim() || steps[0].image);
            console.log('CustomShoeResult - Image URL set after loading state (old API)');
          }, 50);
          // Reset image loading after showing the loading animation
          setTimeout(() => {
            setIsImageLoading(false);
            console.log('CustomShoeResult - Image loading reset to false (old API)');
          }, 1200);
        } else {
          // No image in old API result, use default and don't show loading
          setCurrentImage(steps[0].image);
          setIsImageLoading(false);
          console.log('CustomShoeResult - No image in old API result, using default');
        }
        if (apiResult.allProducts) {
          setAllProducts(apiResult.allProducts);
        }
      }
    } else {
      // Failed API result
      setDisplayedText(steps[0].text);
      setCurrentImage(steps[0].image);
      setIsImageLoading(false);
    }
    
    setApiProcessed(true);
    
    // Only reset loading states if this useEffect set them (for initial processing)
    if (!isListening) {
      setIsApiLoading(false);
      console.log('CustomShoeResult - API loading reset to false, initial processing complete');
    }
  }, [apiResult, apiProcessed, isListening]);

  // Additional useEffect to monitor image changes
  useEffect(() => {
    console.log('Current image updated to:', currentImage); // Debug log
    console.log('API processed flag:', apiProcessed); // Debug log
  }, [currentImage]);

  // Debug useEffect to monitor loading states
  useEffect(() => {
    console.log('Loading states - isImageLoading:', isImageLoading, 'isApiLoading:', isApiLoading);
  }, [isImageLoading, isApiLoading]);

  // Debug useEffect to track component re-renders
  useEffect(() => {
    console.log('CustomShoeResult component rendered/re-rendered');
    console.log('apiResult prop:', apiResult);
  });

  // Initialize speech recognition (only once)
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
        console.log('Speech recognition started in CustomShoeResult');
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
          console.log('Final transcript received:', finalTranscript);
          console.log('Accumulated text:', accumulatedTextRef.current);
        }
        
        // Update display text with accumulated + interim text (live transcription)
        setDisplayedText(accumulatedTextRef.current + interimTranscript);
        setInterimText(interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = async () => {
        setIsListening(false);
        setInterimText('');
        
        const finalText = accumulatedTextRef.current.trim();
        console.log('Speech recognition ended. Final text:', finalText);
        
        if (finalText) {
          // Mark that we have performed at least one in-page voice search
          setHasVoiceSearch(true);
          
          // Set loading states when API call starts
          setIsImageLoading(true);
          setIsApiLoading(true);
          console.log('CustomShoeResult - Loading states set to true before API call');
          
          try {
            console.log('Calling API with text:', finalText);
            const newApiResult = await searchProducts(finalText);
            console.log('New API result received:', newApiResult);
            
            if (newApiResult.success) {
              const internalProducts = Array.isArray(newApiResult.result?.products)
                ? newApiResult.result.products
                : Array.isArray(newApiResult.allProducts)
                  ? newApiResult.allProducts
                  : [];
              const internalProductCount =
                typeof newApiResult.result?.product_count === 'number'
                  ? newApiResult.result.product_count
                  : typeof newApiResult.productCount === 'number'
                    ? newApiResult.productCount
                    : internalProducts.length;

              // Handle zero-products case from in-page voice search
              if (internalProductCount === 0 || internalProducts.length === 0) {
                console.log('CustomShoeResult - In-page voice search returned zero products');
                setNoProductsFromVoice(true);
                setDisplayedText(newApiResult.user_query || finalText);
                // Use default image and stop loading
                setCurrentImage(steps[0].image);
                setIsImageLoading(false);
                setIsApiLoading(false);
                return;
              }

              // Successful response with at least one product
              const firstInternalProduct = newApiResult.product || internalProducts[0];
              if (firstInternalProduct) {
                setNoProductsFromVoice(false);
                setDisplayedText(finalText);
                setCurrentImage(firstInternalProduct.img || currentImage || steps[0].image);
              }
              
              // Update all products for Edit Design
              if (newApiResult.allProducts) {
                setAllProducts(newApiResult.allProducts);
              }
              
              // Replace all entities with new response entities
              if (internalProducts.length > 0 && internalProducts[0].entities && Array.isArray(internalProducts[0].entities)) {
                // Entities are now strings, not objects - use directly
                const newEntities = internalProducts[0].entities;
                // Replace entire entity list with new response entities
                setCurrentEntities(newEntities);
                console.log('CustomShoeResult - Replaced entities with new response:', newEntities);
              }
              
              // Reset loading states after successful API response
              setTimeout(() => {
                setIsImageLoading(false);
                setIsApiLoading(false);
                console.log('CustomShoeResult - Loading states reset after API response');
              }, 1000);
            } else {
              // Update the current display with new results
              // Reset loading states for failed API response
              setIsImageLoading(false);
              setIsApiLoading(false);
              console.log('CustomShoeResult - Loading states reset after failed API response');
            }
          } catch (error) {
            console.error('Error calling API:', error);
            // Reset loading states on API error
            setIsImageLoading(false);
            setIsApiLoading(false);
            console.log('CustomShoeResult - Loading states reset after API error');
          }
        }
      };

      recognitionRef.current = recognition;
    }
  }, []); // Remove currentImage dependency

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const typeText = (text) => {
    setDisplayedText('');
    setIsTyping(true);
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 50); // Faster typing for better UX
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 500);
  };

  const handleBack = () => {
    setIsVisible(false);
    setTimeout(() => {
      onBack && onBack();
    }, 500);
  };

  const handlePlayAudio = () => {
    if (currentStep >= steps.length - 1) return; // No more steps
    
    setIsPlaying(true);
    
    // Move to next step
    const nextStep = currentStep + 1;
    const nextStepData = steps[nextStep];
    
    // Start typing the new text
    setTimeout(() => {
      typeText(nextStepData.text);
    }, 500);
    
    // Change image after text completes (estimated time)
    setTimeout(() => {
      setCurrentImage(nextStepData.image);
      setCurrentStep(nextStep);
      setIsPlaying(false);
    }, 500 + (nextStepData.text.length * 50) + 500); // typing delay + text length + buffer
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
      // Start recording - clear previous text
      setDisplayedText(''); // Clear for live transcription
      setInterimText(''); // Clear any interim text
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Error starting speech recognition:', error);
        }
      }
    }
  };

  const handleEditDesign = () => {
    // Show loading animation first
    setShowEditLoading(true);
  };

  const handleEditLoadingComplete = () => {
    setShowEditLoading(false);
    // Take first 4 products from API result
    const editProducts = allProducts.slice(0, 4);

    // Persist these products so ShoeDesignPage can restore them even after navigation
    if (editProducts && editProducts.length > 0) {
      try {
        sessionStorage.setItem('editDesignProducts', JSON.stringify(editProducts));
      } catch (e) {
        console.log('Failed to store editDesignProducts in sessionStorage');
      }
    }

    // Navigate to design page with these products in location.state as well
    navigate('/design', { 
      state: { 
        products: editProducts
      } 
    });
  };

  // Entity display system - show current entities from latest response
  const displayedEntities = useMemo(() => {
    // If we have current entities, show them
    if (currentEntities.length > 0) {
      return currentEntities;
    }
    
    // Initial load: show first product entities from apiResult
    if (apiResult && apiResult.result?.products && apiResult.result.products.length > 0) {
      const firstProduct = apiResult.result.products[0];
      if (firstProduct.entities && Array.isArray(firstProduct.entities)) {
        // Entities are now strings, not objects - return directly
        return firstProduct.entities;
      }
    }
    
    // Fallback to static features if no API data
    return steps[currentStep].features;
  }, [currentEntities, apiResult, currentStep]);

  return (
    <div className={`custom-shoe-result ${isVisible ? 'fade-in' : 'fade-out'}`}>
      {/* Reuse existing Navbar */}
      <Navbar />

      {/* Page Title with Close Button */}
      <div className="page-title">
        <h1>YOUR CUSTOM AEROSOLE</h1>
        <button className="close-btn" onClick={handleClose} aria-label="Close">
          <FaTimes />
        </button>
      </div>

      {showZeroProducts ? (
        // Case 1: API returned zero products (or in-page voice search with zero products)
        <>
          <div className="no-products-wrapper">
            <div className="no-products-message">
              <h2>No products found</h2>
              <p>We couldn&apos;t find any shoes matching your request. Please try a different description.</p>
            </div>
          </div>

          {/* Allow user to immediately give another voice request */}
          <div className="transcript-section">
            <p className="transcript-text">
              {displayedText}
              {isListening && (
                <span className="typing-cursor">|</span>
              )}
            </p>
            <div className="audio-controls">
              <div className="sound-wave-icon">
                {isPlaying || isListening ? (
                  <div className="wave-bars">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  <div className="static-audio-bars">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </div>
              {isListening ? (
                <button 
                  className="stop-recording-btn"
                  onClick={handleMicrophoneToggle} 
                  aria-label="Stop recording"
                >
                  STOP RECORDING
                </button>
              ) : (
                <button 
                  className={`sound-btn ${!speechSupported ? 'disabled' : ''}`}
                  onClick={handleMicrophoneToggle} 
                  aria-label="Start recording"
                >
                  <FaMicrophone />
                </button>
              )}
            </div>
          </div>
        </>
      ) : lowConfidenceFirstProduct ? (
        // Case 2: First product has low confidence
        <div className="no-products-wrapper">
          <div className="no-products-message">
            <h2>No strong matches found</h2>
            <p>We couldn&apos;t confidently match your request, but here&apos;s one option you might like. Please try another description for better results.</p>
          </div>
          {firstApiProduct && (
            <div className="suggested-product-card">
              <div className="suggested-image">
                {firstApiProduct.img ? (
                  <img
                    src={firstApiProduct.img}
                    alt={firstApiProduct.title || 'Suggested product'}
                    onError={(e) => {
                      console.log('Suggested image failed to load, using fallback');
                      e.target.src = steps[0].image;
                    }}
                  />
                ) : (
                  <div className="loading-container">
                    <LoadingSpinner size="large" />
                  </div>
                )}
              </div>
              <div className="suggested-info">
                <h3>{firstApiProduct.title || 'Suggested product'}</h3>
                <p>{firstApiProduct.short_description || firstApiProduct.subtitle}</p>
                <button
                  className="view-product-btn"
                  type="button"
                  onClick={() => {
                    // Navigate to product detail page with the suggested product
                    const item = {
                      id: `suggested-${firstApiProduct.title || 'product'}`,
                      title: firstApiProduct.title || 'Suggested Product',
                      build: firstApiProduct.short_description || 'Custom build configuration',
                      price: firstApiProduct.price || '$70.00',
                      mainImage: firstApiProduct.img || '/images/design1.png',
                      description: firstApiProduct.short_description,
                      sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11'],
                    };
                    navigate(`/product/${item.id}`, { state: { item } });
                  }}
                >
                  VIEW THIS PRODUCT
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Main Content */}
          <div className="main-content">
            {/* Custom Shoe Image */}
            <div className="shoe-display">
              {isImageLoading || isApiLoading ? (
                <div className="loading-container">
                  <LoadingSpinner size="large" />
                </div>
              ) : currentImage ? (
                <img 
                  src={currentImage} 
                  alt="Custom AeroSole Shoe" 
                  className="shoe-image"
                  onError={(e) => {
                    console.log('Image failed to load, using fallback');
                    e.target.src = steps[0].image; // Fallback to default image
                  }}
                />
              ) : (
                <div className="loading-container">
                  <LoadingSpinner size="large" />
                </div>
              )}
            </div>

            {/* Feature Buttons - Hide during loading */}
            {!isImageLoading && !isApiLoading && (
              <div className="feature-buttons">
                {displayedEntities.map((entity, index) => (
                  <button key={index} className="feature-btn">
                    <span>{entity}</span>
                    <div className="btn-arrow">↗</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Transcript/Description */}
          <div className="transcript-section">
            <p className="transcript-text">
              {displayedText}
              {isListening && (
                <span className="typing-cursor">|</span>
              )}
            </p>
            <div className="audio-controls">
              <div className="sound-wave-icon">
                {isPlaying || isListening ? (
                  <div className="wave-bars">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  <div className="static-audio-bars">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </div>
              {isListening ? (
                <button 
                  className="stop-recording-btn"
                  onClick={handleMicrophoneToggle} 
                  aria-label="Stop recording"
                >
                  STOP RECORDING
                </button>
              ) : (
                <button 
                  className={`sound-btn ${!speechSupported ? 'disabled' : ''}`}
                  onClick={handleMicrophoneToggle} 
                  aria-label="Start recording"
                >
                  <FaMicrophone />
                </button>
              )}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="footer-bar">
            {/* Left: Product Details */}
            <div className="footer-left">
              <div className="product-name">
                {isImageLoading || isApiLoading
                  ? ""
                  : currentFooterProduct && currentFooterProduct.title
                    ? currentFooterProduct.title
                    : "Premium AeroSole Shoe"}
              </div>
              <div className="product-price">
                {isImageLoading || isApiLoading
                  ? ""
                  : currentFooterProduct && currentFooterProduct.price
                    ? currentFooterProduct.price
                    : "$95.00"}
              </div>
            </div>
            
            {/* Center: Action Buttons */}
            <div className="footer-center">
              <button className="action-btn" onClick={handleEditDesign}>
                EDIT THIS DESIGN
              </button>
              <button className="action-btn alternatives-btn">
                <span className="btn-icon">↻</span>
                SEE ALTERNATIVES
              </button>
            </div>
            
            {/* Right: Checkout Button */}
            <div className="footer-right">
              <button className="checkout-btn">
                CHECKOUT
              </button>
            </div>
          </div>

          {/* Edit Design Loading Screen */}
          <EditDesignLoading 
            isVisible={showEditLoading} 
            onComplete={handleEditLoadingComplete}
          />
        </>
      )}
    </div>
  );
};

export default CustomShoeResult;
