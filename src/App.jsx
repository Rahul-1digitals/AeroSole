import React, { useState, createContext, useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CarouselSection from './components/CarouselSection';
import CustomShoeResult from './components/CustomShoeResult';
import ShoeDesignPage from './components/ShoeDesignPage';
import ProductDetailPage from './components/ProductDetailPage';
import ShowcaseSlider from './components/ShowcaseSlider';
import AIVoiceRecorder from './components/AIVoiceRecorder';
import './App.scss';

// Create context for global AI recorder state
const AIRecorderContext = createContext();

// Custom hook to use AI recorder
export const useAIRecorder = () => {
  const context = useContext(AIRecorderContext);
  if (!context) {
    throw new Error('useAIRecorder must be used within AIRecorderProvider');
  }
  return context;
};

// Provider component
const AIRecorderProvider = ({ children }) => {
  const [showAIRecorder, setShowAIRecorder] = useState(false);
  const [onComplete, setOnComplete] = useState(null);
  const isRecordingRef = useRef(false);

  const openAIRecorder = (onCompleteCallback) => {
    console.log('openAIRecorder called');
    isRecordingRef.current = true;
    setShowAIRecorder(true);
    setOnComplete(() => onCompleteCallback);
  };

  const closeAIRecorder = () => {
    console.log('closeAIRecorder called');
    isRecordingRef.current = false;
    setShowAIRecorder(false);
    setOnComplete(null);
  };

  const handleAIRecorderComplete = (apiResult) => {
    if (onComplete) {
      onComplete(apiResult);
    }
    closeAIRecorder();
  };

  return (
    <AIRecorderContext.Provider value={{ openAIRecorder, closeAIRecorder }}>
      {children}
      {showAIRecorder && (
        <>
          {console.log('AIRecorderProvider rendering AIVoiceRecorder, showAIRecorder:', showAIRecorder)}
          <AIVoiceRecorder
            isVisible={showAIRecorder}
            onClose={closeAIRecorder}
            onComplete={handleAIRecorderComplete}
          />
        </>
      )}
    </AIRecorderContext.Provider>
  );
};

// Home Page Component
function HomePage() {
  const navigate = useNavigate();
  const { openAIRecorder } = useAIRecorder();

  const handleShowCustomResult = (apiResult) => {
    // Only navigate to custom shoe page if API result is successful
    if (apiResult && apiResult.success) {
      navigate('/custom-shoe', { state: { apiResult } });
    } else {
      // If no speech detected, error occurred, or API failed, stay on home page
      console.log('AI recording failed or no speech detected, staying on home page:', apiResult);
      // Optionally show a toast or alert to inform user
      if (apiResult && apiResult.error) {
        // You can add a toast notification here if needed
        console.log('Error:', apiResult.error);
      }
    }
  };

  const handleAIRecorderComplete = (apiResult) => {
    // After voice recording is complete, show the custom result page with API data
    if (apiResult && apiResult.success) {
      navigate('/custom-shoe', { state: { apiResult } });
    }
  };

  return (
    <>
      {/* Global video background */}
      <video
        className="global-hero-video"
        src="/aerosole/videos/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="global-hero-overlay" />
      <div className="global-content">
        <Navbar />
        <ShowcaseSlider />
        <HeroSection onShowCustomResult={handleShowCustomResult} />
        <CarouselSection />
        <div className="scroll-spacer" />
      </div>
    </>
  );
}

// Custom Shoe Page Component
function CustomShoePage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get API result from navigation state
  const apiResult = location.state?.apiResult;

  const handleClose = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <CustomShoeResult 
      onClose={handleClose} 
      onBack={handleBack} 
      apiResult={apiResult}
    />
  );
}
// Shoe Design Page Component
function ShoeDesignPageRoute() {
  return <ShoeDesignPage />;
}

const App = () => {
  return (
    <AIRecorderProvider>
      <Router basename="/aerosole">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/custom-shoe" element={<CustomShoePage />} />
          <Route path="/custom-shoe-result" element={<CustomShoePage />} />
          <Route path="/design" element={<ShoeDesignPageRoute />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </Router>
    </AIRecorderProvider>
  );
};

export default App;
