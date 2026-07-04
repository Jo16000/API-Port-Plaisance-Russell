const Reservation = require("../models/reservationModel");
const Catway = require("../models/catwayModel");

// Fonction interne pour vérifier que le catway n'est pas déjà réservé à ces dates
async function checkDisponibilite(catwayNumber, startDate, endDate, excludeReservationId = null) {
  const debut = new Date(startDate);
  const fin = new Date(endDate);
  
  const query = {
    catwayNumber: catwayNumber,
    $or: [
      { startDate: { $lte: fin }, endDate: { $gte: debut } }
    ]
  };

  if (excludeReservationId) {
    query._id = { $ne: excludeReservationId };
  }

  const conflit = await Reservation.find(query);
  return conflit.length === 0;
}

// 1. Lister toutes les réservations d'un catway
exports.getReservationsByCatway = async (req, res) => {
  try {
    const reservations = await Reservation.find({ catwayNumber: req.params.catwayId });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Récupérer les détails d'une réservation (Correction du nom et du paramètre)
exports.getReservationDetails = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ 
      catwayNumber: req.params.catwayId, 
      _id: req.params.idReservation 
    });
    if (!reservation) return res.status(404).json({ message: "Réservation introuvable." });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Créer une réservation
exports.createReservation = async (req, res) => {
  try {
    const { clientName, boatName, startDate, endDate } = req.body;
    const catwayNumber = req.params.catwayId;

    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) return res.status(404).json({ message: "Catway introuvable." });

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "La date de début doit précéder la date de fin." });
    }

    const dispo = await checkDisponibilite(catwayNumber, startDate, endDate);
    if (!dispo) return res.status(400).json({ message: "Ce catway est déjà occupé à ces dates." });

    await Reservation.create({ catwayNumber, clientName, boatName, startDate, endDate });

    if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
      return res.redirect("/views/reservations");
    }
    res.status(201).json({ message: "Réservation créée !" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 4. MODIFICATION (Fonction ajoutée et complétée pour le brief)
exports.updateReservation = async (req, res) => {
  try {
    const { clientName, boatName, startDate, endDate } = req.body;
    const catwayNumber = req.params.catwayId;
    
    // Récupère l'ID depuis le formulaire (body) ou l'URL (query)
    const idReservation = req.body.idReservation || req.query.idReservation; 

    const reservation = await Reservation.findById(idReservation);
    if (!reservation) return res.status(404).json({ message: "Réservation introuvable." });

    if (startDate && endDate) {
      if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ message: "La date de début doit précéder la date de fin." });
      }
      const dispo = await checkDisponibilite(catwayNumber, startDate, endDate, idReservation);
      if (!dispo) return res.status(400).json({ message: "Ce catway est déjà occupé à ces dates." });
    }

    await Reservation.findByIdAndUpdate(idReservation, { $set: req.body }, { new: true });

    if (req.headers["content-type"] === "application/x-www-form-urlencoded" || req.query._method === "PUT") {
      return res.redirect("/views/reservations");
    }
    res.json({ message: "Réservation modifiée avec succès." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 5. Supprimer une réservation (Correction du paramètre idReservation)
exports.deleteReservation = async (req, res) => {
  try {
    const deleted = await Reservation.findOneAndDelete({ 
      catwayNumber: req.params.catwayId, 
      _id: req.params.idReservation 
    });
    if (!deleted) return res.status(404).json({ message: "Réservation introuvable." });

    if (req.headers["content-type"] === "application/x-www-form-urlencoded" || req.query._method === "DELETE") {
      return res.redirect("/views/reservations");
    }
    res.json({ message: "Réservation annulée." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};