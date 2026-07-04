const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const auth = require("../middleware/authMiddleware");

// 1. Lister l'ensemble des réservations pour un catway spécifique
router.get("/catways/:catwayId/reservations", auth, reservationController.getReservationsByCatway);

// 2. Récupérer les détails d'une réservation en particulier
router.get("/catways/:catwayId/reservations/:idReservation", auth, reservationController.getReservationDetails);

// 3. Créer une réservation
router.post("/catways/:catwayId/reservations", auth, reservationController.createReservation);

// 4. Modifier une réservation
router.put("/catways/:catwayId/reservations", auth, reservationController.updateReservation);

// 5. Supprimer une réservation
router.delete("/catways/:catwayId/reservations/:idReservation", auth, reservationController.deleteReservation);

module.exports = router;