import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff } from 'lucide-react'; // for show/hide icons
import API from '../api.js';
import Button from '../components/Button';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || 'https://accounts.kerliix.com';
  const passwordFromLogin = searchParams.get('password') || '';

  useEffect(() => {
    if (passwordFromLogin) {
      setPassword(passwordFromLogin);
      setConfirmPassword(passwordFromLogin);
    }
  }, [passwordFromLogin]);

  const isFormValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    username.trim() !== '' &&
    email.trim() !== '' &&
    dob.trim() !== '' &&
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
        dob,
        password,
        confirmPassword,
      });

      toast.success(res.data.message);

      navigate(
        `/verify-email?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(
          redirectUrl
        )}`
      );
    } catch (error) {
      console.error('Registration error response:', error.response);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create an Account - Kerliix</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-900 via-black to-gray-900">
        <div className="bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex space-x-4">
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* DOB */}
            <input
              type="date"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 pr-10 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 pr-10 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                placeholder="Verify Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-300"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit" disabled={!isFormValid} isLoading={isSubmitting}>
              Register
            </Button>

            <div className="mt-6 text-center text-white text-sm">
              Already have an account?{' '}
              <button
                onClick={() =>
                  navigate(
                    `/login?redirect=${encodeURIComponent(redirectUrl)}&password=${encodeURIComponent(
                      password
                    )}`
                  )
                }
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
