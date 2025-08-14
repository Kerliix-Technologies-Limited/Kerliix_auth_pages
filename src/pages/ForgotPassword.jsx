import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isEmailValid) {
      toast.error('Please enter a valid email.');
      return;
    }

    setIsSubmitting(true);

    // Simulate sending reset link
    setTimeout(() => {
      toast.success('Password reset link sent! Please check your email.');
      setIsSubmitting(false);
      setEmail('');
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - Kerliix</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-900 via-black to-gray-900">
        <div className="bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md border border-white/20 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">Forgot Password</h2>
          <p className="mb-4 text-center text-sm text-gray-300">
            Enter your email and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-white">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isEmailValid}
              className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-200
                ${
                  isSubmitting
                    ? 'bg-blue-700 text-white cursor-wait'
                    : !isEmailValid
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
