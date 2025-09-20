import React from 'react';

// Added 'maxWidthClass' prop, with a default of 'max-w-md'
const Modal = ({ children, onClose, maxWidthClass = 'max-w-md' }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 z-60 flex justify-center items-center" onClick={onClose}>
    {/* Use the maxWidthClass here */}
    <div className={`bg-white rounded-lg shadow-xl p-6 w-full ${maxWidthClass} m-4 animate-fade-in-down`} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

export default Modal;