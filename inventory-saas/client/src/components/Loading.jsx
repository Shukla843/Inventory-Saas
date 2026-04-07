import React from 'react';

/**
 * Loading Spinner Component
 * Shows a centered loading spinner
 */
const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
