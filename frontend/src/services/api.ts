import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bookit-backend.onrender.com/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Experience APIs
export const experienceAPI = {
  getAll: () => api.get('/experiences'),
  getById: (id: string) => api.get(`/experiences/${id}`),
};


// Booking APIs
export const bookingAPI = {
  create: (bookingData: any) => api.post('/bookings', bookingData),
  getByReference: (referenceId: string) => api.get(`/bookings/${referenceId}`),
};

// Promo APIs
export const promoAPI = {
  validate: (promoData: { promoCode: string; totalAmount: number }) => 
    api.post('/promo/validate', promoData),
};

export default api;
