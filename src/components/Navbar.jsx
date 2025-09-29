import React from 'react';
import { FaSearch, FaUser, FaShoppingBag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        {/* Replace with actual logo image if available */}
        <span className="navbar__brand">AeroSole</span>
      </div>
      <ul className="navbar__links">
        <li>Sale</li>
        <li>New & Featured</li>
        <li>Women</li>
        <li>Men</li>
        <li>Kids</li>
        <li>West End Store</li>
        <li>Customs</li>
      </ul>
      <div className="navbar__icons">
        <button aria-label="Search" className="navbar__icon-btn"><FaSearch /></button>
        <button aria-label="User Profile" className="navbar__icon-btn"><FaUser /></button>
        <button aria-label="Shopping Bag" className="navbar__icon-btn"><FaShoppingBag /></button>
      </div>
    </nav>
  );
};

export default Navbar;
