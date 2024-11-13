import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchAvailableSlots = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/available_slots`, {
      params: {
        // Optionnel : vous pouvez spécifier une plage de dates
        // startDate: new Date().toISOString(),
        // endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux :', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const bookItem = async (bookingData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/book_item`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la réservation :', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Nouvelle Fonction pour Supprimer une Réservation
export const deleteBooking = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/book_item/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation :', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Nouvelle Fonction pour Fetch les Chevaux
export const fetchHorses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/horses`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des chevaux :', error.response ? error.response.data : error.message);
    throw error;
  }
};
