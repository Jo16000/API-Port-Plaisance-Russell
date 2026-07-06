// ==========================================
// 1. CONFIGURATION DES VARIABLES D'ENVIRONNEMENT
// ==========================================
// On n'utilise dotenv qu'en mode développement (sur ton PC local)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ override: true });
}

// ==========================================
// 2. IMPORTATIONS DES MODULES ET PACKAGES
// ==========================================
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

// Importation de vos routeurs applicatifs
const viewRoutes = require('./routes/viewRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const catwayRoute = require('./routes/catwayRoute');
const reservationRoute = require('./routes/reservationRoute');

// Initialisation de l'application Express
const app = express();

// ==========================================
// 3. CONFIGURATION DU MOTEUR DE RENDU (EJS)
// ==========================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ==========================================
// 4. MIDDLEWARES GLOBAUX
// ==========================================
// Permet de servir vos fichiers CSS statiques (ex: /css/style.css)
app.use(express.static(path.join(__dirname, 'public')));

// Analyse les corps des requêtes entrantes (JSON et formulaires HTML)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Permet de lire et manipuler les cookies (indispensable pour votre JWT 'token')
app.use(cookieParser());

// Permet d'utiliser PUT et DELETE via l'override d'un formulaire (?_method=PUT)
app.use(methodOverride('_method'));

// ==========================================
// 5. BRANCHEMENT DES ROUTES APPLICATIVES
// ==========================================
// Routes d'affichage des interfaces graphiques EJS et accueil
app.use('/', viewRoutes);

// Routes d'authentification pure (API et déconnexion)
app.use('/', authRoutes);

// Routes de l'API REST sécurisées pour la gestion des données
app.use('/users', userRoutes);
app.use('/catways', catwayRoute);
app.use('/', reservationRoute); // Partage la racine pour intercepter /catways/:id/reservations

// Middleware de gestion des erreurs 404 (si aucune route ne correspond)
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Page introuvable - 404' });
});

// Middleware de gestion globale des erreurs système (Express 5.x)
app.use((err, req, res, next) => {
  console.error('💥 Une erreur non gérée est survenue :', err.stack);
  res.status(500).send('Une erreur interne est survenue sur le serveur.');
});

// ==========================================
// 6. CONNEXION MONGODB & LANCEMENT DU SERVEUR
// ==========================================
// Utilise en priorité process.env.MONGO_URI injecté par Render, sinon l'adresse locale par défaut
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/port-plaisance-russell";
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connexion réussie à la base de données MongoDB !");
    
    // Le serveur ne démarre que si la base de données répond présente
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé avec succès sur le port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Échec critique de la connexion à MongoDB :", err.message);
    process.exit(1);
  });

module.exports = app; // Utile si vous réalisez des tests unitaires (Supertest)