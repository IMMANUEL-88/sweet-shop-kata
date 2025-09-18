import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const baseClasses =
    'fixed top-5 left-1/2 transform -translate-x-1/2 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-down z-50';
  const typeClasses = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 font-bold text-lg focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
};

export default Notification;
