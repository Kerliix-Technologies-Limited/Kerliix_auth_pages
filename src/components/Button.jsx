// components/Button.jsx
import React from 'react';

export default function Button({ type = 'button', disabled, isLoading, children, onClick }) {
  const baseClasses =
    'w-full py-2 px-4 rounded-lg font-semibold transition duration-200';
  const loadingClasses = 'bg-blue-700 text-white cursor-wait';
  const disabledClasses = 'bg-gray-600 text-gray-400 cursor-not-allowed';
  const activeClasses = 'bg-blue-600 hover:bg-blue-700 text-white';

  const buttonClasses = `${baseClasses} ${
    isLoading
      ? loadingClasses
      : disabled
      ? disabledClasses
      : activeClasses
  }`;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={buttonClasses}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
