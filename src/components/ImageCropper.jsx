import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import PropTypes from 'prop-types';

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // for CORS if needed
    image.src = url;
  });
}

/**
 * Returns a promise that resolves with a blob of the cropped area from the image
 * @param {string} imageSrc URL or base64 string of the source image
 * @param {object} crop { x, y } percentage values from react-easy-crop
 * @param {object} zoom zoom level from react-easy-crop
 * @param {object} croppedAreaPixels pixel values of the crop area from react-easy-crop
 * @returns {Promise<Blob>} cropped image blob
 */
export async function getCroppedImg(imageSrc, croppedAreaPixels) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const { width, height } = croppedAreaPixels;
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    width,
    height,
    0,
    0,
    width,
    height
  );

  // convert canvas to blob (promise wrapper)
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg', 0.9); // jpeg quality 0.9
  });
}

export default function ImageCropper({ imageSrc, onCropComplete, aspect = 1 }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    if (onCropComplete) onCropComplete(croppedAreaPixels);
  }, [onCropComplete]);

  return (
    <div className="relative w-full h-64 bg-black/70 rounded-lg overflow-hidden">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={aspect} // square crop
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropCompleteHandler}
      />
      {/* Zoom slider */}
      <input
        type="range"
        min={1}
        max={3}
        step={0.1}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4"
      />
    </div>
  );
}

ImageCropper.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  onCropComplete: PropTypes.func,
  aspect: PropTypes.number,
};
