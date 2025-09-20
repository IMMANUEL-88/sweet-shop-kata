import React, { useState, useEffect } from 'react';

const SweetForm = ({ sweet, onFormSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    quantity: 0,
  });
  const [error, setError] = useState('');

  // When the 'sweet' prop changes (i.e., when editing), update the form
  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
      });
    } else {
      // Reset for "Add New"
      setFormData({ name: '', category: '', price: 0, quantity: 0 });
    }
  }, [sweet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle number inputs
    const parsedValue = (name === 'price' || name === 'quantity') ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Pass the form data to the parent submit handler
      await onFormSubmit(formData);
    } catch (err) {
      // The parent will re-throw the error, which we catch here to display
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-2xl font-bold mb-4">{sweet ? 'Edit Sweet' : 'Add New Sweet'}</h3>
      {error && <p className="text-red-500 bg-red-100 p-2 rounded-md">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input type="number" name="price" step="0.01" min="0" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input type="number" name="quantity" min="0" value={formData.quantity} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" placeholder="https://example.com/image.jpg" />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">Save</button>
      </div>
    </form>
  );
};

export default SweetForm;