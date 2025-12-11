import React, { useEffect, useState } from 'react';
import { FaSearch, FaUser, FaShoppingBag, FaMicrophone, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Navbar.scss';

const NAV_PANEL_SECTIONS = {
  'New & Featured': [
    { label: 'West End Store', path: '/' },
    { label: 'Customs', path: '/' },
  ],
  Women: [
    { label: 'West End Store', path: '/' },
    { label: 'Customs', path: '/' },
  ],
  Men: [
    { label: 'West End Store', path: '/' },
    { label: 'Customs', path: '/' },
  ],
  Kids: [
    { label: 'West End Store', path: '/' },
    { label: 'Customs', path: '/' },
  ],
  Sale: [
    { label: 'West End Store', path: '/' },
    { label: 'Customs', path: '/' },
  ],
};

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('New & Featured');

  const handleLogoClick = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
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

  const navbarClassName = `navbar${isScrolled ? ' navbar-scrolled-white' : ''}`;

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
            <button aria-label="Voice Assistant" className="navbar__icon-btn">
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
