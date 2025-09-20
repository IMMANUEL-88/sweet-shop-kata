import React from 'react';
import Modal from './Modal.jsx';

const SuccessModal = ({ onClose }) => {
  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center justify-center p-6">
        {/* Green Check Animation */}
        <div className="svg-container w-24 h-24">
          <svg className="success-svg" viewBox="0 0 52 52">
            <circle
              className="success-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="success-check"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              d="M14 27l7 7 17-17"
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-2">
          Order Successful!
        </h2>
        <p className="text-gray-600 text-center">
          Your sweets are on their way. Thank you for your purchase!
        </p>
        <button
          onClick={onClose}
          className="w-full mt-8 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </Modal>
  );
};

export default SuccessModal;
