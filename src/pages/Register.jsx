import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
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

  const isOldEnough = () => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());
    if (!hasBirthdayPassed) age--;
    return age >= 13;
  };

  const isFormValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    username.trim() !== '' &&
    email.trim() !== '' &&
    dob.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    password === confirmPassword &&
    isOldEnough();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      if (!isOldEnough()) {
        toast.error('You must be at least 13 years old to register.');
      } else {
        toast.error('Please fill in all fields correctly.');
      }
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
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-900 via-black to-gray-900">
        <div className="bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-full">
            {/* Names */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-white text-sm mb-1" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-white text-sm mb-1" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-white text-sm mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                placeholder="yourusername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-sm mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-white text-sm mb-1" htmlFor="dob">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="YYYY-MM-DD"
                max={new Date().toISOString().split('T')[0]}
                required
              />
              {!isOldEnough() && dob && (
                <p className="text-red-400 text-sm mt-1">
                  You must be at least 13 years old.
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 pr-16 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                  placeholder="Password"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-white text-sm mb-1" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 pr-16 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300"
                  placeholder="Verify Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-300 hover:text-white"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={!isFormValid} isLoading={isSubmitting}>
              Register
            </Button>

            <div className="mt-6 text-center text-white text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/login?redirect=${encodeURIComponent(
                      redirectUrl
                    )}&password=${encodeURIComponent(password)}`
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
