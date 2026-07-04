const express = require("express");
const router = express.Router();
const catwayController = require("../controllers/catwayController");
const auth = require("../middleware/authMiddleware"); // Import de la sécurité

// Toutes les routes de gestion des catways deviennent privées
router.get("/", auth, catwayController.getAllCatways);
router.get("/:id", auth, catwayController.getCatwayById);
router.post("/", auth, catwayController.createCatway);
router.put("/:id", auth, catwayController.updateCatway);
router.delete("/:id", auth, catwayController.deleteCatway);

module.exports = router;