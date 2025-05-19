import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import MapVisualization from './components/MapVisualization';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import InfoPanel from './components/InfoPanel';
import Header from './components/Header';
import Login from './pages/Login';
import { DisasterProvider } from './context/DisasterContext';

function Dashboard() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsAdmin(userRole === 'admin');
  }, []);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <DisasterProvider>
      <div className="flex flex-col h-screen bg-gray-100">
        <Header isAdmin={isAdmin} />
        
        <div className="flex flex-1 overflow-hidden">
          <button 
            className="md:hidden absolute top-16 left-4 z-30 bg-white p-2 rounded-md shadow-md"
            onClick={togglePanel}
          >
            <Menu size={24} />
          </button>
          
          <div className={`${isPanelOpen ? 'translate-x-0' : '-translate-x-full'} 
                          transition-transform duration-300 ease-in-out
                          absolute md:relative z-20 w-80 h-[calc(100%-4rem)] md:h-full 
                          bg-white shadow-lg md:shadow-none`}>
            {isAdmin ? <AdminPanel /> : <UserPanel />}
          </div>
          
          <div className="flex-1 relative z-10">
            <MapVisualization />
          </div>
          
          <div className="hidden md:block w-80 bg-white shadow-lg">
            <InfoPanel />
          </div>
        </div>
      </div>
    </DisasterProvider>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsLoggedIn(!!userRole);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App