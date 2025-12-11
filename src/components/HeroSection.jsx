import React from 'react';
import { motion } from 'framer-motion';
import { FaPen, FaMicrophone } from 'react-icons/fa';
import { useAIRecorder } from '../App';
import './HeroSection.scss';

const HeroSection = ({ onShowCustomResult }) => {
  const { openAIRecorder } = useAIRecorder();

  const handleSpeakToAI = () => {
    openAIRecorder((apiResult) => {
      // After voice recording is complete, show the custom result page with API data
      if (onShowCustomResult) {
        onShowCustomResult(apiResult);
      }
    });
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
          WHAT SHOE WILL YOU <span style={{ position: 'relative', display: 'inline-block' }}>
            T
            <span style={{ 
              position: 'absolute', 
              top: '0', 
              left: '0', 
              width: '100%', 
              height: '100%', 
              background: 'linear-gradient(to bottom right, transparent 45%, currentColor 47%, currentColor 53%, transparent 55%)',
              pointerEvents: 'none'
            }}></span>
          </span>MAKE?
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
    </section>
  );
};

export default HeroSection;
