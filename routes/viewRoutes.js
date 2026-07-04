const express = require("express");
const router = express.Router();
const Catway = require("../models/catwayModel");
const Reservation = require("../models/reservationModel");
const User = require("../models/userModel");
const auth = require("../middleware/authMiddleware");

// Route "/" : Page d'accueil / Connexion
router.get("/", (req, res) => {
  res.render("index", { error: null });
});

// Route "/dashboard" : Tableau de bord sécurisé
router.get("/dashboard", auth, async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.render("dashboard", {
      user: req.user,
      dateJour: new Date().toLocaleDateString("fr-FR"),
      reservations: reservations
    });
  } catch (error) {
    res.status(500).send("Erreur lors du chargement du tableau de bord.");
  }
});

// Route "/views/catways" : Affichage de l'interface CRUD des Catways
router.get("/views/catways", auth, async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.render("catways", { catways });
  } catch (error) {
    res.status(500).send("Erreur lors du chargement des catways.");
  }
});

// Route "/views/reservations" : Affichage de l'interface CRUD des Réservations
router.get("/views/reservations", auth, async (req, res) => {
  try {
    const reservations = await Reservation.find();
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.render("reservations", { reservations, catways });
  } catch (error) {
    res.status(500).send("Erreur lors du chargement des réservations.");
  }
});

// Route "/views/users" : Affichage de l'interface CRUD des Utilisateurs (Secrétariat)
router.get("/views/users", auth, async (req, res) => {
  try {
    const users = await User.find();
    res.render("users", { users });
  } catch (error) {
    res.status(500).send("Erreur lors du chargement des utilisateurs.");
  }
});

// Route "/logout" : Déconnexion (Exigence stricte du brief)
router.get("/logout", (req, res) => {
  res.clearCookie("token"); // Supprime le cookie de session
  res.redirect("/");        // Redirige vers la page de login
});

module.exports = router;