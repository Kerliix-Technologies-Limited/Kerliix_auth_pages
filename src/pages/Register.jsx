import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import API from '../api.js';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const isFormValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    username.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error('Please fill in all fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await API.post('/auth/register', {
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword,
      });

      toast.success(res.data.message);
      navigate('/verify-email');
    } catch (error) {
      console.error('Registration error response:', error.response);
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create an Account - Kerliix</title>
        <meta
          name="description"
          content="Register to create your Kerliix account and join the community."
        />
        <meta name="keywords" content="register, signup, create account, Kerliix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Create an Account - Kerliix" />
        <meta
          property="og:description"
          content="Register to create your Kerliix account and join the community."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Create an Account - Kerliix" />
        <meta
          name="twitter:description"
          content="Register to create your Kerliix account and join the community."
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-900 via-black to-gray-900">
        <div className="bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                placeholder="Verify Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
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
                'Register'
              )}
            </button>

            <div className="mt-6 text-center text-white text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-300 hover:underline"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
