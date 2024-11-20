const bcrypt = require('bcrypt');
const Utilisateur = require('../models/user');
const jwt = require('jsonwebtoken');

// Connexion simple de l'utilisateur
exports.login = (req, res, next) => {
  Utilisateur.findOne({ email: req.body.email }) // Recherche par email
    .then((utilisateur) => {
      if (!utilisateur) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt
        .compare(req.body.password, utilisateur.password) // Vérifie le mot de passe
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: utilisateur._id,
            name: utilisateur.name,
            email: utilisateur.email,
            token: jwt.sign(
              { userId: utilisateur._id },
              process.env.JWT_SECRET,
              { expiresIn: '24h' }
            ),
          });
        })
        .catch((error) => {
          console.error('Erreur lors de la comparaison des mots de passe :', error);
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      console.error("Erreur lors de la recherche de l'utilisateur :", error);
      res.status(500).json({ error });
    });
};

// Inscription de l'utilisateur
exports.signup = (req, res, next) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d@$!%*?&^#().,]{8,}$/;
  if (!passwordRegex.test(req.body.password)) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.' });
  }

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const utilisateur = new Utilisateur({
        name: req.body.name, // Nom d'utilisateur
        email: req.body.email || '', // Optionnel
        password: hash,
      });

      utilisateur
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé avec succès !' }))
        .catch((error) => {
          console.error('Erreur lors de la création de l\'utilisateur :', error);
          res.status(400).json({ error });
        });
    })
    .catch((error) => {
      console.error('Erreur lors du hachage du mot de passe :', error);
      res.status(500).json({ error });
    });
};

// Récupération des informations utilisateur
exports.getUserInfo = (req, res) => {
  const userId = req.auth.userId; // Récupérer l'ID utilisateur depuis req.auth
  Utilisateur.findById(userId)
    .select('-password') // Exclure le mot de passe
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé !' });
      }
      res.status(200).json(user);
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des informations utilisateur :', error);
      res.status(500).json({ error });
    });
};
