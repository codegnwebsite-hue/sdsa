
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SessionPage from './pages/SessionPage';
import VerifyHandler from './pages/VerifyHandler';
import ApiGenerate from './pages/ApiGenerate';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0a0a0b] text-[#f4f4f5]">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <Routes>
            {/* Main Portal View */}
            <Route path="/" element={<Home />} />
            
            {/* Verification Session View */}
            <Route path="/v/:slug" element={<SessionPage />} />
            
            {/* Logic-only verification callback handler */}
            <Route path="/verify" element={<VerifyHandler />} />
            
            {/* API Generation Console (Developer View) */}
            <Route path="/api/console" element={<ApiGenerate />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
