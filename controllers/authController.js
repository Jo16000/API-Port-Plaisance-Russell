const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
// ÉTAPE 2 : Utilisation de bcryptjs pour la comparaison de mot de passe sécurisée
const bcrypt = require('bcryptjs');

/**
 * Gère la connexion de l'utilisateur (Personnel de la capitainerie)
 * Route: POST /login
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            // Si l'utilisateur n'existe pas, on recharge la page d'accueil avec une erreur
            return res.status(401).render('index', { error: 'Email ou mot de passe incorrect.' });
        }

        // 2. Vérifier si le mot de passe correspond à la version hachée
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).render('index', { error: 'Email ou mot de passe incorrect.' });
        }

        // 3. Générer le Token JWT
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET || 'SECRET_PORT_RUSSELL',
            { expiresIn: '2h' }
        );

        // 4. Stocker le JWT dans un cookie HTTP-Only sécurisé
        res.cookie('token', token, {
            httpOnly: true, // Protège le cookie contre les attaques XSS
            secure: process.env.NODE_ENV === 'production', // Active le HTTPS uniquement en production (Render)
            maxAge: 2 * 60 * 60 * 1000 // Expire après 2 heures
        });

        // 5. Redirection vers le tableau de bord demandée par le brief
        return res.redirect('/dashboard');

    } catch (error) {
        console.error(error);
        return res.status(500).render('index', { error: 'Une erreur serveur est survenue.' });
    }
};

/**
 * Gère la déconnexion de l'utilisateur
 * Route: GET /logout
 */
exports.logout = (req, res) => {
    // Supprime le cookie contenant le jeton JWT
    res.clearCookie('token');
    // Redirection immédiate vers la page d'accueil demandée par le brief
    return res.redirect('/');
};