import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

export default function AddPhone() {
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isPhoneValid = /^\+?\d{10,15}$/.test(phone); // Basic validation

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isPhoneValid) {
      toast.error('Please enter a valid phone number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      toast.success('Phone number added successfully!');
      setIsSubmitting(false);
      navigate('/verify-phone');
    }, 2000);
  };

  const handleSkip = () => {
    toast.info('You skipped phone number setup.');
    navigate('/profile-picture');
  };

  return (
    <>
      <Helmet>
        <title>Add Phone Number - Kerliix</title>
        <meta name="description" content="Add your phone number to secure your account at Kerliix." />
        <meta name="keywords" content="add phone, phone number, Kerliix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content="Add Phone Number - Kerliix" />
        <meta property="og:description" content="Add your phone number to secure your account at Kerliix." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Add Phone Number - Kerliix" />
        <meta name="twitter:description" content="Add your phone number to secure your account." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-900 via-black to-gray-900">
        <div className="bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md border border-white/20 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">Add Your Phone Number</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-white">Phone Number</label>
              <input
                type="tel"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-300 text-center text-lg"
                placeholder="+12345678901"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={!isPhoneValid || isSubmitting}
              className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-200
                ${
                  isSubmitting
                    ? 'bg-blue-700 text-white cursor-wait'
                    : !isPhoneValid
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              {isSubmitting ? 'Processing...' : 'Add Phone Number'}
            </button>
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
