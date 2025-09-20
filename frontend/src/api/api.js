import axios from 'axios';

// Create a central Axios instance
const api = axios.create({
  baseURL: '/api', // Vite will proxy this to your backend
});

/**
 * Sets the authorization token for all subsequent Axios requests.
 * @param {string} token - The JWT token.
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// --- Auth Service ---
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (userData) => api.post('/auth/login', userData);

// --- Sweets Service ---
export const getSweets = () => api.get('/sweets');
export const searchSweets = (params) => api.get('/sweets/search', { params });
export const addSweet = (sweetData) => api.post('/sweets', sweetData);
export const updateSweet = (id, sweetData) => api.put(`/sweets/${id}`, sweetData);
export const deleteSweet = (id) => api.delete(`/sweets/${id}`);

// --- Inventory Service ---
export const purchaseSweet = (id) => api.post(`/sweets/${id}/purchase`);
export const restockSweet = (id, amount) => api.post(`/sweets/${id}/restock`, { amount });

// --- Cart Service ---
export const addToCart = (cartData) => {
  // cartData should be { sweetId, quantity }
  return api.post('/cart', cartData);
};

export const getCart = () => {
  return api.get('/cart');
};

export const deleteCartItem = (sweetId) => {
  return api.delete(`/cart/${sweetId}`);
};

export const purchaseFromCart = () => {
  return api.post('/cart/purchase');
};

export default api; 