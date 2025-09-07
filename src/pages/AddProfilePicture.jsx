import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import API from '../api.js';
import Button from '../components/Button';
import ImageCropper, { getCroppedImg } from '../components/ImageCropper';
import { compressImage } from '../components/useImageCompression';

export default function AddProfilePicture() {
  const [file, setFile] = useState(null);
  const [rawImage, setRawImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCropping, setIsCropping] = useState(false); // Controls modal visibility

  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get('redirect');

  const getInitials = () => {
    if (!user) return '';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';

    if (!firstName && !lastName) return '';

    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();

    return `${firstInitial}${lastInitial}`;
  };

  const initials = getInitials();

  // When user picks a file, open cropping modal
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setRawImage(URL.createObjectURL(selectedFile));
      setFile(null);
      setPreviewUrl(null);
      setIsCropping(true);
    } else {
      toast.error('Please select a valid image file.');
    }
  };

  const onCropComplete = useCallback((croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Crop & compress and close modal
  const handleCropAndCompress = async () => {
    if (!rawImage || !croppedAreaPixels) {
      toast.error('Please select and crop the image.');
      return;
    }
    try {
      const croppedImgBlob = await getCroppedImg(rawImage, croppedAreaPixels);
      const compressedFile = await compressImage(croppedImgBlob, 2);

      setFile(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
      setIsCropping(false);
      toast.success('Image cropped and compressed successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to crop or compress image.');
    }
  };

  // Cancel cropping and close modal
  const handleCancelCrop = () => {
    setRawImage(null);
    setIsCropping(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select and crop your profile picture or skip this step.');
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

  const handleRedirect = () => {
    if (redirectUrl && redirectUrl.trim() !== '') {
      window.location.href = redirectUrl;
    } else {
      navigate('/welcome');
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
        <div
          className={`bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md border border-white/20 text-white
          ${isCropping ? 'pointer-events-none opacity-50' : ''}`} // disable interaction under modal
        >
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
                disabled={isCropping}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isCropping}
              isLoading={isSubmitting}
            >
              Upload Profile Picture
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleSkip}
                disabled={isCropping}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Skip this step
              </button>
            </div>
          </form>
        </div>

        {/* Cropping modal */}
        {isCropping && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-lg">
              <h3 className="text-white text-xl font-semibold mb-4 text-center">Crop Your Profile Picture</h3>

              <div className="relative w-full h-96 bg-black">
                <ImageCropper
                  imageSrc={rawImage}
                  onCropComplete={onCropComplete}
                  aspect={1}
                />
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={handleCancelCrop}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCropAndCompress}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Crop & Compress
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
