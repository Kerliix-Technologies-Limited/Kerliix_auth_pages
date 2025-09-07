import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import API from '../api.js';
import Button from '../components/Button';

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // Step 1: email/username, Step 2: password

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || 'https://accounts.kerliix.com';

  // Check email/username validity in step 1
  const handleEmailOrUsernameSubmit = async (e) => {
    e.preventDefault();

    if (emailOrUsername.trim() === '') {
      toast.error('Please enter your email or username');
      return;
    }

    setIsSubmitting(true);

    try {
      // Assuming you have an API endpoint to validate if email/username exists:
      await API.post('/auth/check-username', { emailOrUsername });

      // If successful, go to step 2 to show password input
      setStep(2);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Email or username not found. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Actual login with password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (password.trim() === '') {
      toast.error('Please enter your password');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await API.post('/auth/login', {
        emailOrUsername,
        password,
      });

      const userData = response.data;

      login(userData);
      toast.success(`Logged in as: ${userData.firstName} ${userData.lastName}`);

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

          {step === 1 && (
            <form onSubmit={handleEmailOrUsernameSubmit} className="space-y-5">
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

              <Button type="submit" disabled={emailOrUsername.trim() === ''} isLoading={isSubmitting}>
                Next
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-white mb-1">Email or Username</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300 cursor-not-allowed"
                  value={emailOrUsername}
                  disabled
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

              <Button type="submit" disabled={password.trim() === ''} isLoading={isSubmitting}>
                Log In
              </Button>

              <div className="text-left">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-blue-300 hover:underline"
                >
                  Back
                </button>
              </div>
            </form>
          )}

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
