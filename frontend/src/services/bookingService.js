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
    const token = localStorage.getItem('token'); // Récupérer le token JWT
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Ajouter le token au header Authorization
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fonction pour récupérer les informations utilisateur
export const fetchUserInfo = async () => {
  try {
    const response = await axiosInstance.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur :', error);
    throw error;
  }
};

// Fonction pour récupérer les créneaux disponibles
export const fetchAvailableSlots = async () => {
  try {
    const response = await axiosInstance.get('/available_slots');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux :', error);
    throw error;
  }
};

// Fonction pour créer une réservation
export const createBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la réservation :', error);
    throw error;
  }
};

// Fonction pour récupérer les chevaux
export const fetchHorses = async () => {
  try {
    const response = await axiosInstance.get('/horses');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des chevaux :', error);
    throw error;
  }
};

// Fonction pour récupérer les réservations
export const fetchBookings = async () => {
  try {
    const response = await axiosInstance.get('/bookings');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations :', error);
    throw error;
  }
};

// Fonction pour appeler l'API de création de chevaux 
export const createHorse = async (horseData) => {
  try {
    const response = await axiosInstance.post('/horses', horseData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du cheval :', error);
    throw error;
  }
};

//Fonction pour la suppression d'une résa
export const deleteBooking = async (id) => {
  try {
    const response = await axiosInstance.delete(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation :', error);
    throw error;
  }
};

// Fonction pour la suppression d'une réservation via book_item/:id
export const deleteBookItem = async (id) => {
  try {
    const response = await axiosInstance.delete(`/bookings/book_item/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation via book_item :', error);
    throw error;
  }
};