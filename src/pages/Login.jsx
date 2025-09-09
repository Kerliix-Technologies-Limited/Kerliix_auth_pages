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
  const [step, setStep] = useState(1); // 1: identify, 2: password/passkey
  const [userMeta, setUserMeta] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const redirectUrl =
    searchParams.get('redirect') || 'https://accounts.kerliix.com';

  // Step 1: Identify user
  const handleEmailOrUsernameSubmit = async (e) => {
    e.preventDefault();

    if (emailOrUsername.trim() === '') {
      toast.error('Please enter your email or username');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await API.post('/auth/check-user-exists', {
        emailOrUsername,
      });

      setUserMeta(res.data);
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

  // Step 2A: Login with password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (password.trim() === '') {
      toast.error('Please enter your password');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await API.post('/auth/login/password', {
        emailOrUsername,
        password,
      });

      const data = response.data;

      if (data.mfaRequired) {
        navigate('/mfa-verify', {
          state: {
            userId: data.userId,
            mfaMethods: data.mfaMethods,
            redirectUrl,
          },
        });
      } else {
        login(data);
        toast.success(
          `Logged in as: ${data.firstName} ${data.lastName}`
        );
        window.location.href = redirectUrl;
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2B: Login with passkey
  const handlePasskeyLogin = async () => {
    setIsSubmitting(true);
    try {
      const response = await API.post('/auth/login/passkey', {
        emailOrUsername,
      });

      const data = response.data;

      if (data.mfaRequired) {
        navigate('/mfa-verify', {
          state: {
            userId: data.userId,
            mfaMethods: data.mfaMethods,
            redirectUrl,
          },
        });
      } else {
        login(data);
        toast.success(
          `Logged in as: ${data.firstName} ${data.lastName}`
        );
        window.location.href = redirectUrl;
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Passkey login failed.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Welcome back - Kerliix</title>
        <meta
          name="description"
          content="Login to access your account on Kerliix."
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-900 via-black to-gray-900">
        <div className="bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Login
          </h2>

          {step === 1 && (
            <form
              onSubmit={handleEmailOrUsernameSubmit}
              className="space-y-5"
            >
              <div>
                <label className="block text-white mb-1">
                  Email or Username
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                  placeholder="you@example.com or username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={emailOrUsername.trim() === ''}
                isLoading={isSubmitting}
              >
                Next
              </Button>
            </form>
          )}

          {step === 2 && (
            <>
              <form
                onSubmit={handlePasswordSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="block text-white mb-1">
                    Email or Username
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none cursor-not-allowed"
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

                <div className="flex items-center justify-between">
                  <Button
                    type="submit"
                    disabled={password.trim() === ''}
                    isLoading={isSubmitting}
                  >
                    Log In
                  </Button>

                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-blue-300 hover:underline ml-3"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>

              {userMeta?.hasPasskeys && (
                <div className="mt-4">
                  <Button
                    type="button"
                    onClick={handlePasskeyLogin}
                    isLoading={isSubmitting}
                  >
                    Use Passkey
                  </Button>
                </div>
              )}

              <div className="text-left mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-blue-300 hover:underline"
                >
                  Back
                </button>
              </div>
            </>
          )}

          <div className="mt-6 text-center text-white text-sm">
            Don&apos;t have an account?{' '}
            <button
              onClick={() =>
                navigate(
                  `/register${
                    redirectUrl
                      ? `?redirect=${encodeURIComponent(redirectUrl)}`
                      : ''
                  }`
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
