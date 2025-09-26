import './style.css';
import App from './App.jsx';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('app')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
