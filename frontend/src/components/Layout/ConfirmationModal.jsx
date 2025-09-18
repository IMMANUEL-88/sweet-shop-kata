import React from 'react';
import Modal from './Modal.jsx';

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => (
  <Modal onClose={onCancel}>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-gray-600 mb-6">{message}</p>
    <div className="flex justify-end gap-4">
      <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
      <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Confirm</button>
    </div>
  </Modal>
);

export default ConfirmationModal;