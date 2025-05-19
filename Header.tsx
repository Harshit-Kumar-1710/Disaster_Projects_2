import React from 'react';
import { AlertTriangle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  isAdmin: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAdmin }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
    window.location.reload(); // Force reload to clear any cached states
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-3 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-7 w-7 text-yellow-300" />
          <h1 className="text-xl font-bold">Smart Disaster Evacuation Planning</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-md ${
            isAdmin ? 'bg-red-600' : 'bg-green-600'
          }`}>
            {isAdmin ? 'Admin Mode' : 'User Mode'}
          </span>
          <span className="animate-pulse flex items-center">
            <span className="h-3 w-3 rounded-full bg-green-400 mr-2"></span>
            System Active
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-1 bg-blue-800 rounded-md hover:bg-blue-900 transition-colors"
          >
            <LogOut size={16} className="mr-1" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header