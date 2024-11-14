import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Fonction pour récupérer les créneaux réservés
export const fetchBookings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations :', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fonction pour réserver un créneau
export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la réservation :', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fonction pour supprimer une réservation
export const deleteBooking = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation :', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fonction pour récupérer la liste des chevaux
export const fetchHorses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/horses`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des chevaux :', error.response ? error.response.data : error.message);
    throw error;
  }
};
