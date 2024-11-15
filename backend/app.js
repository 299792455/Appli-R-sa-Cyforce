require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Import des routes
const userRoutes = require('./routes/userRoute');
const horseRoutes = require('./routes/horses');
const bookingRoutes = require('./routes/bookings');

// Middleware global
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(error => console.log('Connexion à MongoDB échouée !', error));

// Gestion des en-têtes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Gestion des fichiers statiques
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/horses', horseRoutes);
app.use('/api/bookings', bookingRoutes);

module.exports = app;
