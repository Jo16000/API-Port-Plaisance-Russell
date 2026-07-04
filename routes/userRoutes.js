const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware"); // Import de la sécurité

// Toutes les routes de gestion des secrétaires/agents deviennent privées
router.get("/", auth, userController.getAllUsers);
router.get("/:email", auth, userController.getUserByEmail);
router.post("/", auth, userController.createUser);
router.put("/:email", auth, userController.updateUser);
router.delete("/:email", auth, userController.deleteUser);

module.exports = router;