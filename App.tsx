
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
            <Route path="/" element={<Home />} />
            {/* Verification Session Route */}
            <Route path="/v/:slug" element={<SessionPage />} />
            {/* Logic-only verification handler */}
            <Route path="/verify" element={<VerifyHandler />} />
            {/* API Generation Endpoint */}
            <Route path="/api/generate" element={<ApiGenerate />} />
            {/* Catch-all route to handle environment-specific paths or 404s */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
