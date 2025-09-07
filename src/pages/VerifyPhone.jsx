import { useState } from 'react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api.js';
import Button from '../components/Button.jsx';

export default function VerifyPhone() {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Extract email and redirect URL from query parameters
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const redirectUrl = queryParams.get('redirect') || 'https://accounts.kerliix.com';

  const isCodeValid = /^\d{8}$/.test(code); // Updated to 8-digit verification code

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isCodeValid) {
      toast.error('Please enter a valid 8-digit verification code.');
      return;
    }

    if (!email) {
      toast.error('Email is missing. Please try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await API.post('/auth/verify-phone', {
        code,
        email,
      });

      login(res.data.user); // Update user context if necessary

      toast.success('Phone verified successfully!');

      // Always navigate to profile picture step, passing along params
      navigate(`/profile-picture?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirectUrl)}`);
    } catch (error) {
      console.error('Phone verification failed:', error);
      const message =
        error?.response?.data?.message || 'Phone verification failed. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Verify Your Phone - Kerliix</title>
        <meta
          name="description"
          content="Please verify your phone to complete your registration at Kerliix."
        />
        <meta name="keywords" content="verify phone, phone verification, Kerliix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content="Verify Your Phone - Kerliix" />
        <meta
          property="og:description"
          content="Please verify your phone to complete your registration at Kerliix."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Verify Your Phone - Kerliix" />
        <meta
          name="twitter:description"
          content="Please verify your phone to complete your registration at Kerliix."
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-900 via-black to-gray-900">
        <div className="bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md border border-white/20 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">Verify Your Phone</h2>
          <p className="mb-6 text-center text-lg">
            Enter the 8-digit code sent to your phone to verify your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-white">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-white/10 text-gray-300 cursor-not-allowed"
                value={email || ''}
                disabled
              />
            </div>

            <div>
              <label className="block mb-1 text-white">Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={8}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300 text-center tracking-widest text-lg"
                placeholder="Enter 8-digit code"
                value={code}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val) && val.length <= 8) {
                    setCode(val);
                  }
                }}
                required
              />
            </div>

            {/* Replaced native button with reusable Button component */}
            <Button type="submit" disabled={!isCodeValid || isSubmitting} isLoading={isSubmitting}>
              Verify Phone
            </Button>

            <p className="mt-4 text-center text-sm text-gray-300">
              Didn't receive the code?{' '}
              <button
                type="button"
                className="text-blue-400 hover:underline"
                onClick={() => toast.info('Resend phone verification functionality coming soon!')}
              >
                Resend code
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
