import React from 'react';

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4 animate-fade-in-down" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

export default Modal;