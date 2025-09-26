import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPen, FaMicrophone } from 'react-icons/fa';
import AIVoiceRecorder from './AIVoiceRecorder';
import './HeroSection.scss';

const HeroSection = ({ onShowCustomResult }) => {
  const [showAIRecorder, setShowAIRecorder] = useState(false);

  const handleSpeakToAI = () => {
    setShowAIRecorder(true);
  };

  const handleCloseAIRecorder = () => {
    setShowAIRecorder(false);
  };

  const handleAIRecorderComplete = () => {
    // After voice recording is complete, show the custom result page immediately
    if (onShowCustomResult) {
      onShowCustomResult();
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-subtitle">
          <div className="hero-subtitle-line1">Originality never goes out of style.</div>
          <div className="hero-subtitle-line2">Customize every inch of your favorite AeroSole with our AI-powered creator.</div>
        </div>
        <motion.h1
          className="hero-headline"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          WHAT SHOE WILL YOU MAKE?
        </motion.h1>
        <div className="hero-cta-buttons">
          <button className="hero-btn">
            <FaPen className="hero-btn-icon" aria-hidden="true" />
            WRITE YOUR PROMPT
          </button>
          <button className="hero-btn" onClick={handleSpeakToAI}>
            <FaMicrophone className="hero-btn-icon" aria-hidden="true" />
            SPEAK TO OUR AI TOOL
          </button>
        </div>
        <div className="hero-guide-container">
          <div className="hero-guide-line"></div>
          <a href="#guide" className="hero-guide-link">
            View guide or examples
          </a>
          <div className="hero-guide-line"></div>
        </div>
      </div>
      
      <AIVoiceRecorder 
        isVisible={showAIRecorder} 
        onClose={handleCloseAIRecorder}
        onComplete={handleAIRecorderComplete}
      />
    </section>
  );
};

export default HeroSection;
