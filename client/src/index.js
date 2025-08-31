/**
 * Baybar Kurumsal Tanıtım Sitesi
 * Ana giriş noktası - React uygulamasını DOM'a bağlar
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// React 18 ile yeni createRoot API'sini kullanıyoruz
const container = document.getElementById('root');
const root = createRoot(container);

// Uygulamayı gerekli provider'lar ile sarmalıyoruz
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Web Vitals performans ölçümü (opsiyonel)
reportWebVitals();