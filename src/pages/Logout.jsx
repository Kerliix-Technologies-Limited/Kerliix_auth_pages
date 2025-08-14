import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user session data here (localStorage/sessionStorage/cookies)
    localStorage.removeItem('authToken'); // example
    localStorage.removeItem('userData');  // example

    toast.success('Logged out successfully!');

    // Redirect to login page after 2 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    // Cleanup timeout on unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Logout - Kerliix</title>
        <meta name="description" content="You have been logged out from Kerliix." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-900 via-black to-gray-900">
        <div className="bg-white/10 p-8 rounded-lg shadow-lg max-w-md w-full backdrop-blur-md border border-white/20 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Logging Out...</h2>
          <p className="text-lg">You are being logged out and will be redirected shortly.</p>
        </div>
      </div>
    </>
  );
}
