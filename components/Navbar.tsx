
import React from 'react';

interface NavbarProps {
  username: string;
  balance: number;
  onLogout: () => void;
  onWalletClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, balance, onLogout, onWalletClick }) => {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="font-orbitron font-bold text-xl">G</span>
        </div>
        <span className="font-orbitron font-bold text-lg hidden sm:block">GAMEARENA<span className="text-indigo-500">PRO</span></span>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onWalletClick}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-full border border-gray-700 transition-colors"
        >
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] text-white">
            $
          </div>
          <span className="font-semibold text-green-400">₹{balance.toLocaleString()}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
          <button 
            onClick={onLogout}
            className="text-gray-400 hover:text-white text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
