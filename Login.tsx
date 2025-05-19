import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, LogIn, Shield, User } from 'lucide-react';

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check for admin credentials
      if (username === 'mohit' && password === '5885') {
        localStorage.setItem('userRole', 'admin');
        setIsLoggedIn(true);
        navigate('/dashboard');
      } else {
        // For demo purposes, allow any non-empty username/password for users
        if (username && password) {
          localStorage.setItem('userRole', 'user');
          setIsLoggedIn(true);
          navigate('/dashboard');
        } else {
          setError('Invalid username or password');
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <AlertTriangle className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Evacuation System</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-center space-x-4 mb-4">
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Admin Login</p>
              <p className="text-xs text-gray-500">username: mohit</p>
              <p className="text-xs text-gray-500">password: 5885</p>
            </div>
            <div className="text-center">
              <User className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">User Login</p>
              <p className="text-xs text-gray-500">Any credentials</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
          >
            <LogIn className="h-5 w-5 mr-2" />
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Emergency services? Contact your administrator for access.
        </p>
      </div>
    </div>
  );
};

export default Login