// bookingService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Fonction pour obtenir le token depuis le localStorage
const getToken = () => localStorage.getItem('token');

// Créer une instance Axios avec configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Ajouter un intercepteur pour inclure le token dans chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fonction pour récupérer les créneaux disponibles
export const fetchAvailableSlots = async () => {
  try {
    const response = await axiosInstance.get('/available_slots');
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des créneaux :',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Fonction pour créer une réservation
export const createBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la réservation :',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Fonction pour récupérer les chevaux
export const fetchHorses = async () => {
  try {
    const response = await axiosInstance.get('/horses');
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des chevaux :',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Fonction pour récupérer les réservations
export const fetchBookings = async () => {
  try {
    const response = await axiosInstance.get('/bookings');
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des réservations :',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
