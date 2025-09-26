import React, { useState, useEffect } from 'react';
import { FaTimes, FaMicrophone } from 'react-icons/fa';
import Navbar from './Navbar';
import EditDesignLoading from './EditDesignLoading';
import './CustomShoeResult.scss';

const CustomShoeResult = ({ onClose, onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentImage, setCurrentImage] = useState('/images/custom-shoe-leopard.png');
  const [showEditLoading, setShowEditLoading] = useState(false);

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
    // Fade in immediately when component mounts
    setIsVisible(true);
    // Set initial text
    setDisplayedText(steps[0].text);
  }, []);

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

  const handleEditDesign = () => {
    setShowEditLoading(true);
  };

  const handleEditLoadingComplete = () => {
    setShowEditLoading(false);
    // Here you can navigate to the actual edit page or show edit results
    console.log('Edit loading completed - navigate to edit page');
  };

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

      {/* Main Content */}
      <div className="main-content">
        {/* Custom Shoe Image */}
        <div className="shoe-display">
          <img 
            src={currentImage} 
            alt="Custom AeroSole Shoe" 
            className="shoe-image"
          />
        </div>

        {/* Feature Buttons */}
        <div className="feature-buttons">
          {steps[currentStep].features.map((feature, index) => (
            <button key={index} className="feature-btn">
              <span>{feature}</span>
              <div className="btn-arrow">↗</div>
            </button>
          ))}
        </div>
      </div>

      {/* Transcript/Description */}
      <div className="transcript-section">
        <p className="transcript-text">
          {displayedText}
        </p>
        <div className="audio-controls">
          <div className="sound-wave-icon">
            {isPlaying ? (
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
          <button 
            className={`sound-btn ${currentStep >= steps.length - 1 ? 'non-functional' : ''}`}
            onClick={currentStep >= steps.length - 1 ? undefined : handlePlayAudio} 
            aria-label="Play audio"
          >
            <FaMicrophone />
          </button>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="footer-bar">
        {/* Left: Product Details */}
        <div className="footer-left">
          <div className="product-name">Premium AeroSole Shoe</div>
          <div className="product-price">$95.00</div>
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
    </div>
  );
};

export default CustomShoeResult;
