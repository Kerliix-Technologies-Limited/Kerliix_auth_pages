import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file to target size <= maxSizeMB (default 2MB)
 * @param {File|Blob} file - original image file/blob
 * @param {number} maxSizeMB - max size in megabytes
 * @returns {Promise<File>} compressed image file
 */
export async function compressImage(file, maxSizeMB = 2) {
  const options = {
    maxSizeMB,
    maxWidthOrHeight: 800, // limit max dimensions, adjust as needed
    useWebWorker: true,
    initialQuality: 0.8,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Image compression error:', error);
    // fallback: return original file if compression fails
    return file;
  }
}
