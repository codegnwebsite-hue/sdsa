
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SessionPage from './pages/SessionPage';
import VerifyHandler from './pages/VerifyHandler';
import ApiGenerate from './pages/ApiGenerate';
import Info from './pages/Info';
import Contact from './pages/Contact';
import Shop from './pages/Shop';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0a0a0b] text-[#f4f4f5]">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/info" element={<Info />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/v/:slug" element={<SessionPage />} />
            <Route path="/verify" element={<VerifyHandler />} />
            <Route path="/api/console" element={<ApiGenerate />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
