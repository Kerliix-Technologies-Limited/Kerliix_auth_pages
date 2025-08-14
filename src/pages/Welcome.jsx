import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  const displayName = user?.name || 'there';

  return (
    <>
      <Helmet>
        <title>Welcome to Kerliix</title>
        <meta name="description" content="Welcome to Kerliix." />
      </Helmet>

      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={250} />
      )}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-black to-gray-900 text-white px-4">
        <motion.div
          className="text-center space-y-6 max-w-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-4xl font-bold md:text-5xl">Welcome, {displayName} 👋</h1>
          <p className="text-xl font-medium text-gray-300">
            Connect. Understand. Unify.
          </p>

          <p className="text-gray-400 text-md">
            You’re all set! Dive into your dashboard and experience seamless collaboration.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200"
          >
            Continue to Dashboard
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
