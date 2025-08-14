import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';

export default function Logout() {
  const [step, setStep] = useState('confirm'); // 'confirm' | 'loading'
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Handles the actual logout logic
  const handleLogout = async () => {
    setStep('loading');
    try {
      await logout();
      toast.success('Logged out successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error) {
      toast.error('Logout failed. Please try again.');
      setStep('confirm');
    }
  };

  // If user cancels, go back or redirect somewhere
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <Helmet>
        <title>Logout - Kerliix</title>
        <meta name="description" content="You have logged out from Kerliix." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-900 via-black to-gray-900">
        <div className="bg-white/10 p-8 rounded-lg shadow-lg max-w-md w-full backdrop-blur-md border border-white/20 text-white text-center">
          {step === 'confirm' && (
            <>
              <h2 className="text-3xl font-bold mb-4">Confirm Logout</h2>
              <p className="mb-6 text-lg">
                Are you sure you want to log out from Kerliix?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 rounded-lg border border-white/50 hover:bg-white/20 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </>
          )}

          {step === 'loading' && (
            <>
              <h2 className="text-3xl font-bold mb-4">Logging Out...</h2>
              <p className="text-lg mb-4">
                You are being logged out and will be redirected shortly.
              </p>
              <div className="flex justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
