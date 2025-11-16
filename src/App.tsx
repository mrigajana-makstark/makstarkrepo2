import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { AboutPage } from './components/AboutPage';
import { ServicesPage } from './components/ServicesPage';
import { PortfolioPage } from './components/PortfolioPage';
import { ContactPage } from './components/ContactPage';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { Navigation } from './components/Navigation';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode] = useState(true); // Always dark mode for this design

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const authStatus = localStorage.getItem('makStarkAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    
    // Apply dark mode class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, [isDarkMode]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('makStarkAuth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('makStarkAuth');
  };

  return (
    <Router basename="/">
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Navigation />
              <LandingPage />
              <FloatingWhatsApp />
            </>
          } />
          <Route path="/about" element={
            <>
              <Navigation />
              <AboutPage />
              <FloatingWhatsApp />
            </>
          } />
          <Route path="/services" element={
            <>
              <Navigation />
              <ServicesPage />
              <FloatingWhatsApp />
            </>
          } />
          <Route path="/portfolio" element={
            <>
              <Navigation />
              <PortfolioPage />
              <FloatingWhatsApp />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Navigation />
              <ContactPage />
              <FloatingWhatsApp />
            </>
          } />
          
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard/*" 
            element={
              isAuthenticated ? 
                <DashboardPage onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}