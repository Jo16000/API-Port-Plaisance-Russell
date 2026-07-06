const User = require('../models/userModel'); // On utilise bien le bon nom de fichier avec le 'M' majuscule
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Utilisation de bcryptjs pour éviter le crash ELF sur Render

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
            return res.status(401).render('index', { error: 'Email ou mot de passe incorrect.' });
        }

        // 2. Vérifier si le mot de passe correspond
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
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 2 * 60 * 60 * 1000
        });

        // 5. Redirection vers le tableau de bord
        return res.redirect('/dashboard');

    } catch (error) {
        console.error(error);
        return res.status(500).render('index', { error: 'Une erreur serveur est survenue.' });
    }
};

/**
 * Gère la création de compte (Requis par authRoutes.js)
 * Route: POST /register
 */
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).render('index', { error: 'Cet email est déjà utilisé.' });
        }

        // Créer l'utilisateur
        const newUser = new User({ username, email, password });
        await newUser.save();

        // Rediriger vers l'accueil avec un message ou connecter directement
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return res.status(500).render('index', { error: "Erreur lors de l'inscription." });
    }
};

/**
 * Gère la déconnexion de l'utilisateur
 * Route: GET /logout
 */
exports.logout = (req, res) => {
    res.clearCookie('token');
    return res.redirect('/');
};