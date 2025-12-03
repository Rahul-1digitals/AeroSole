import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CarouselSection from './components/CarouselSection';
import CustomShoeResult from './components/CustomShoeResult';
import ShoeDesignPage from './components/ShoeDesignPage';
import ProductDetailPage from './components/ProductDetailPage';
import './App.scss';

// Home Page Component
function HomePage() {
  const navigate = useNavigate();

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
        <HeroSection onShowCustomResult={handleShowCustomResult} />
        <CarouselSection />
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
    <Router basename="/aerosole">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/custom-shoe" element={<CustomShoePage />} />
        <Route path="/custom-shoe-result" element={<CustomShoePage />} />
        <Route path="/design" element={<ShoeDesignPageRoute />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;
