import React, { useEffect, useState } from 'react';
import { FaSearch, FaUser, FaShoppingBag, FaMicrophone, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAIRecorder } from '../App';
import './Navbar.scss';

const NAV_PANEL_SECTIONS = {
  'New & Featured': [
    { label: 'West End Store', path: '/' },
    { label: 'Customs', path: '/' },
  ],
  Women: [
    { label: 'Gifts for Her', path: '/' },
    { label: 'New Arrivals', path: '/' },
    { label: 'Best Sellers', path: '/' },
  ],
  Men: [
    { label: 'Gifts for Him', path: '/' },
    { label: 'New Arrivals', path: '/' },
    { label: 'Best Sellers', path: '/' },
  ],
  Kids: [
    { label: 'Gifts for Kids', path: '/' },
    { label: 'New Arrivals', path: '/' },
    { label: 'Best Sellers', path: '/' },
  ],
  Sale: [
    { label: 'Men', path: '/' },
    { label: 'Women', path: '/' },
    { label: 'Kids', path: '/' },
    { label: 'All Sale', path: '/' },
  ],
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openAIRecorder } = useAIRecorder();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('New & Featured');

  const isHomePage = location.pathname === '/';

  const handleLogoClick = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleSpeakToAI = () => {
    openAIRecorder((apiResult) => {
      // After voice recording is complete, navigate to custom shoe page with API data
      if (apiResult && apiResult.success) {
        navigate('/custom-shoe', { state: { apiResult } });
      }
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY || window.pageYOffset;
      setIsScrolled(offset > 16);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navbarClassName = `navbar${isScrolled && isHomePage ? ' navbar-scrolled-white' : ''}${!isHomePage ? ' navbar--glassy' : ''}${!isHomePage && isScrolled ? ' navbar--scrolled-overlay' : ''}`;

  return (
    <nav className={navbarClassName}>
      <div className="navbar__inner">
        {/* Left: hamburger / close */}
        <div className="navbar__section navbar__section--left">
          <button
            type="button"
            className="navbar__menu-toggle"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Center: brand */}
        <div
          className="navbar__section navbar__section--center"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleLogoClick();
            }
          }}
        >
          <span className="navbar__brand">AeroSole</span>
        </div>

        {/* Right: icons including mic */}
        <div className="navbar__section navbar__section--right">
          <div className="navbar__icons">
            <button aria-label="Search" className="navbar__icon-btn">
              <FaSearch />
            </button>
            <button aria-label="Voice Assistant" className="navbar__icon-btn" onClick={handleSpeakToAI}>
              <FaMicrophone />
            </button>
            <button aria-label="User Profile" className="navbar__icon-btn">
              <FaUser />
            </button>
            <button aria-label="Shopping Bag" className="navbar__icon-btn">
              <FaShoppingBag />
            </button>
          </div>
        </div>
      </div>

      {/* Left-side panel navigation */}
      <div className={`navbar__panel ${isMenuOpen ? 'navbar__panel--open' : ''}`}>
        <div className="navbar__panel-inner">
          {/* Close button at top */}
          <button 
            type="button"
            className="navbar__panel-close"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <FaTimes />
          </button>
          
          <div className="navbar__panel-tabs">
            {Object.keys(NAV_PANEL_SECTIONS).map((key) => (
              <button
                key={key}
                type="button"
                className={
                  'navbar__panel-tab' +
                  (key === activeCategory ? ' navbar__panel-tab--active' : '')
                }
                onClick={() => setActiveCategory(key)}
              >
                {key}
              </button>
            ))}
          </div>

          <ul className="navbar__panel-links">
            {NAV_PANEL_SECTIONS[activeCategory].map((item) => (
              <li key={item.label} className="navbar__panel-link-item">
                <button
                  type="button"
                  className="navbar__panel-link"
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="navbar__panel-backdrop"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
