import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import API from '../api.js';

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Get redirect query param, default to accounts.kerliix.com
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || 'https://accounts.kerliix.com';

  const isFormValid = emailOrUsername.trim() !== '' && password.trim() !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send login request to backend
      const response = await API.post('/auth/login', {
        emailOrUsername,
        password,
      });

      const userData = response.data;

      // Update auth context
      login(userData);

      toast.success(`Logged in as: ${userData.username || userData.email}`);

      // Redirect to intended page or default
      window.location.href = redirectUrl;
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Welcome back - Kerliix</title>
        <meta name="description" content="Login to access your account on Kerliix." />
        <meta name="keywords" content="login, Kerliix, user account, authentication" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Welcome back - Kerliix" />
        <meta property="og:description" content="Login to access your account on Kerliix." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-900 via-black to-gray-900">
        <div className="bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white mb-1">Email or Username</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                placeholder="you@example.com or username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-white mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-300 hover:text-white"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-200
                ${
                  isSubmitting
                    ? 'bg-blue-700 text-white cursor-wait'
                    : !isFormValid
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  <span>Processing...</span>
                </div>
              ) : (
                'Log In'
              )}
            </button>

            <div className="text-left">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-blue-300 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-white text-sm">
            Don't have an account?{' '}
            <button
              onClick={() =>
                navigate(
                  `/register${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`
                )
              }
              className="text-blue-300 hover:underline"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
