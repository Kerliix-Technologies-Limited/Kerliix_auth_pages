import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import API from '../api.js';
import Button from '../components/Button';

export default function MfaVerify() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Grab data passed from login screen
  const { userId, mfaMethods, redirectUrl } = location.state || {};

  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!mfaMethods) {
    // No MFA methods passed, redirect to login
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.trim() === '') {
      toast.error('Please enter the verification code');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await API.post('/auth/mfa/verify', {
        userId,
        code,
      });

      const data = response.data;

      login(data);
      toast.success(`Logged in as: ${data.username || data.email}`);
      window.location.href = redirectUrl || '/';
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('MFA verification failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>MFA Verification - Kerliix</title>
        <meta name="description" content="Multi-factor authentication verification." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-900 via-black to-gray-900">
        <div className="bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Multi-Factor Authentication</h2>

          <p className="text-white mb-4">
            Please enter the verification code from your {mfaMethods.join(', ')}.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white mb-1">Verification Code</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                autoFocus
              />
            </div>

            <Button type="submit" isLoading={isSubmitting}>
              Verify
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
