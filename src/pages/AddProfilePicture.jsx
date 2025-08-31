import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import API from '../api.js';

export default function AddProfilePicture() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();

  // Extract redirect param from URL query
  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get('redirect');

  // Helper to get initials from user's first and last name
  const getInitials = () => {
    if (!user) return '';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';

    if (!firstName && !lastName) return '';

    // Take first character of first and last name (if exists)
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();

    return `${firstInitial}${lastInitial}`;
  };

  const initials = getInitials();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      toast.error('Please select a valid image file.');
    }
  };

  const handleRedirect = () => {
    if (redirectUrl && redirectUrl.trim() !== '') {
      window.location.href = redirectUrl;
    } else {
      navigate('/welcome');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a profile picture or skip this step.');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await API.post('/auth/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Profile picture uploaded successfully!');

      if (res.data?.user) {
        login(res.data.user);
      }

      handleRedirect();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload profile picture.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    toast.info('Skipped profile picture setup.');
    handleRedirect();
  };

  return (
    <>
      <Helmet>
        <title>Upload Profile Picture - Kerliix</title>
        <meta
          name="description"
          content="Upload your profile picture to complete your Kerliix profile."
        />
        <meta name="keywords" content="upload profile, profile picture, Kerliix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-900 via-black to-gray-900">
        <div className="bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md border border-white/20 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">Add Profile Picture</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/30"
                />
              ) : initials ? (
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-white/30 bg-blue-600 text-white text-4xl font-bold select-none"
                  aria-label="User initials"
                >
                  {initials}
                </div>
              ) : (
                // fallback default icon if no initials & no preview
                <img
                  src="/assets/kerliix-icon.png"
                  alt="Default Profile Icon"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/30"
                />
              )}
            </div>

            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-200
                ${
                  isSubmitting
                    ? 'bg-blue-700 text-white cursor-wait'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              {isSubmitting ? 'Uploading...' : 'Upload Profile Picture'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleSkip}
                className="mt-4 text-sm text-blue-400 hover:underline"
              >
                Skip this step
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
