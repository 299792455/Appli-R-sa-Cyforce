const bcrypt = require('bcrypt');
const Utilisateur = require('../models/utilisateur');
const jwt = require('jsonwebtoken');

// Regex pour valider le mot de passe et l'email
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d@$!%*?&^#().,]{8,}$/;
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

// Inscription de l'utilisateur
exports.signup = (req, res, next) => {
    if (!passwordRegex.test(req.body.password)) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.' });
    }

    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ error: 'L\'adresse e-mail n\'est pas valide.' });
    }

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const utilisateur = new Utilisateur({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                bio: req.body.bio || '',  // Optionnel, peut être laissé vide
                profileImage: req.body.profileImage || '',  // URL de l'image du profil
                skills: req.body.skills || [],
                socialLinks: req.body.socialLinks || []
            });
            utilisateur.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Connexion de l'utilisateur
exports.login = (req, res, next) => {
    Utilisateur.findOne({ email: req.body.email })
        .then(utilisateur => {
            if (!utilisateur) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, utilisateur.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: utilisateur._id,
                        token: jwt.sign(
                            { userId: utilisateur._id },
                            process.env.JWT_SECRET,  // Utilise JWT_SECRET défini dans .env
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
