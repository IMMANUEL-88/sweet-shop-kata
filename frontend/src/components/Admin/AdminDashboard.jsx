import React, { useState, useEffect, useCallback } from 'react';
import { getSweets, addSweet, updateSweet, deleteSweet, restockSweet } from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Modal from '../Layout/Modal.jsx';
import SweetForm from './SweetForm.jsx';
import ConfirmationModal from '../Layout/ConfirmationModal.jsx'; // Correctly imported

const AdminDashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useAuth();

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [sweetToDelete, setSweetToDelete] = useState(null);
  const [restockAmount, setRestockAmount] = useState(1);

  const fetchSweets = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await getSweets();
      setSweets(data);
    } catch (error) {
      showNotification('Could not fetch sweets.');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  const handleAdd = () => {
    setSelectedSweet(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (sweet) => {
    setSelectedSweet(sweet);
    setIsFormModalOpen(true);
  };

  const handleDelete = (sweet) => {
    setSweetToDelete(sweet);
    setIsConfirmModalOpen(true);
  };

  const handleRestock = (sweet) => {
    setSelectedSweet(sweet);
    setRestockAmount(1); // Reset amount
    setIsRestockModalOpen(true);
  }

  const confirmDelete = async () => {
    if (!sweetToDelete) return;
    try {
      await deleteSweet(sweetToDelete._id);
      setSweets(prev => prev.filter(s => s._id !== sweetToDelete._id));
      showNotification('Sweet deleted successfully!', 'success');
    } catch (error) {
      showNotification('Failed to delete sweet.');
    } finally {
      setIsConfirmModalOpen(false);
      setSweetToDelete(null);
    }
  };
  
  const confirmRestock = async (e) => {
    e.preventDefault();
    if (!selectedSweet) return;
    try {
        const { data: updatedSweet } = await restockSweet(selectedSweet._id, restockAmount);
        setSweets(prev => prev.map(s => s._id === updatedSweet._id ? updatedSweet : s));
        showNotification('Sweet restocked!', 'success');
    } catch (error) {
        showNotification(error.response?.data?.message || 'Restock failed.');
    } finally {
        setIsRestockModalOpen(false);
        setSelectedSweet(null);
    }
  }

  const handleFormSubmit = async (formData) => {
    const isEditing = !!selectedSweet;
    const apiCall = isEditing ? updateSweet(selectedSweet._id, formData) : addSweet(formData);

    try {
      const { data: savedSweet } = await apiCall;
      if (isEditing) {
        setSweets(prev => prev.map(s => s._id === savedSweet._id ? savedSweet : s));
      } else {
        setSweets(prev => [savedSweet, ...prev]);
      }
      showNotification(`Sweet ${isEditing ? 'updated' : 'added'}!`, 'success');
      setIsFormModalOpen(false);
      setSelectedSweet(null);
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to save sweet.');
      // Re-throw to keep the modal open and show the error
      throw err; 
    }
  };

  if (isLoading) {
    return <p className="text-center p-10">Loading inventory...</p>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <button onClick={handleAdd} className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600">Add New Sweet</button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sweets.map(sweet => (
              <tr key={sweet._id}>
                <td className="px-6 py-4 whitespace-nowrap">{sweet.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sweet.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">${sweet.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sweet.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleRestock(sweet)} className="text-green-600 hover:text-green-900 mr-4">Restock</button>
                  <button onClick={() => handleEdit(sweet)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button onClick={() => handleDelete(sweet)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormModalOpen && (
        <Modal onClose={() => setIsFormModalOpen(false)}>
          <SweetForm
            sweet={selectedSweet}
            onFormSubmit={handleFormSubmit}
            onCancel={() => setIsFormModalOpen(false)}
          />
        </Modal>
      )}
      
      {isRestockModalOpen && (
        <Modal onClose={() => setIsRestockModalOpen(false)}>
            <form onSubmit={confirmRestock}>
                <h3 className="text-xl font-bold mb-4">Restock "{selectedSweet?.name}"</h3>
                <p className="mb-4">Current quantity: {selectedSweet?.quantity}</p>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Amount to Add</label>
                    <input 
                        type="number" 
                        value={restockAmount} 
                        onChange={(e) => setRestockAmount(Number(e.target.value))} 
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                        min="1"
                        required 
                    />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={() => setIsRestockModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Restock</button>
                </div>
            </form>
        </Modal>
      )}

      {isConfirmModalOpen && (
        <ConfirmationModal
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${sweetToDelete?.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;