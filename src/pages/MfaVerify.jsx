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

  // Data passed from Login.jsx
  const { userId, mfaMethods, redirectUrl } = location.state || {};

  const [selectedMethod, setSelectedMethod] = useState(
    mfaMethods?.[0] || null
  );
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!mfaMethods) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMethod) {
      toast.error('Please select a verification method');
      return;
    }

    if (code.trim() === '') {
      toast.error('Please enter the verification code');
      return;
    }

    setIsSubmitting(true);

    try {
      let endpoint = '';
      if (selectedMethod === 'totp') endpoint = '/auth/mfa/login/totp';
      if (selectedMethod === 'sms') endpoint = '/auth/mfa/login/sms';
      if (selectedMethod === 'recovery')
        endpoint = '/auth/mfa/login/recovery';

      const response = await API.post(endpoint, {
        userId,
        code,
      });

      const data = response.data;

      login(data);
      toast.success(`Logged in as: ${data.firstName} ${data.lastName}`);
      window.location.href = redirectUrl || '/';
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'MFA verification failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>MFA Verification - Kerliix</title>
        <meta
          name="description"
          content="Multi-factor authentication verification."
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-900 via-black to-gray-900">
        <div className="bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Multi-Factor Authentication
          </h2>

          <p className="text-white mb-4 text-center">
            Please verify using one of your available methods.
          </p>

          <div className="flex justify-center gap-3 mb-6">
            {mfaMethods.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => {
                  setSelectedMethod(method);
                  setCode('');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedMethod === method
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/20 text-gray-200 hover:bg-white/30'
                }`}
              >
                {method.toUpperCase()}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {selectedMethod && (
              <div>
                <label className="block text-white mb-1">
                  {selectedMethod === 'totp' &&
                    'Enter the 6-digit code from your authenticator app'}
                  {selectedMethod === 'sms' &&
                    'Enter the code sent to your phone'}
                  {selectedMethod === 'recovery' &&
                    'Enter one of your recovery codes'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                  placeholder={
                    selectedMethod === 'recovery'
                      ? 'Recovery code'
                      : '123456'
                  }
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            )}

            <Button type="submit" isLoading={isSubmitting}>
              Verify
            </Button>
          </form>
        </div>
      </div>
    </>
  );
                  }
