
import React from 'react';
import { APP_CONFIG } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-white/5 bg-[#0a0a0b]">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} {APP_CONFIG.OWNER_NAME}. All rights reserved.
        </p>
        <p className="text-xs text-gray-600 mt-2 italic">
          Powering {APP_CONFIG.SERVER_NAME} with secure verification flows.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
