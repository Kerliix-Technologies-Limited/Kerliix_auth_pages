import { useState } from 'react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api.js';
import Button from '../components/Button'; // Import the custom Button

export default function AddPhone() {
  const [countryCode, setCountryCode] = useState('+1'); // default country code
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  // Validate country code (should start with + and digits)
  const isCountryCodeValid = /^\+\d{1,4}$/.test(countryCode);
  // Validate phone (digits only, length 4-14 for local number)
  const isPhoneValid = /^\d{4,14}$/.test(phone);
  // Full number validation: combined string with no spaces
  const fullPhone = `${countryCode}${phone}`;
  const isFullPhoneValid = isCountryCodeValid && isPhoneValid;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFullPhoneValid) {
      toast.error('Please enter a valid country code and phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await API.post('/auth/add-phone', { phone: fullPhone });

      if (res.data.user) {
        login(res.data.user);
      }

      toast.success('Phone number added successfully!');
      navigate(`/verify-phone?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('Add phone failed:', error);
      const message =
        error?.response?.data?.message || 'Failed to add phone number. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    toast.info('You skipped phone number setup.');
    navigate(`/profile-picture?email=${encodeURIComponent(email)}`);
  };

  return (
    <>
      <Helmet>
        <title>Add Phone Number - Kerliix</title>
        <meta
          name="description"
          content="Add your phone number to secure your account at Kerliix."
        />
        <meta name="keywords" content="add phone, phone number, Kerliix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-900 via-black to-gray-900">
        <div className="bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md border border-white/20 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">Add Your Phone Number</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-white">Phone Number</label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  className="w-1/4 px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300 text-center text-lg"
                  placeholder="+1"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value.trim())}
                  required
                />
                <input
                  type="tel"
                  className="w-3/4 px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300 text-center text-lg"
                  placeholder="1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // only digits
                  required
                />
              </div>
            </div>

            {/* Use the custom Button component */}
            <Button
              type="submit"
              disabled={!isFullPhoneValid || isSubmitting}
              isLoading={isSubmitting}
            >
              Add Phone Number
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleSkip}
              className="text-sm text-blue-400 hover:underline"
            >
              Skip this step
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
