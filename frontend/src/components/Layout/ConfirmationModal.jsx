import React from 'react';
import Modal from './Modal.jsx';

// We add a new 'isLoading' prop
const ConfirmationModal = ({ title, message, onConfirm, onCancel, isLoading = false }) => {
  return (
    <Modal onClose={onCancel}>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-end gap-4">
        <button 
          onClick={onCancel} 
          disabled={isLoading}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          onClick={onConfirm} 
          disabled={isLoading}
          // Changed from bg-red-600 to bg-pink-500
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:bg-pink-300 w-28"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            'Confirm'
          )}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;