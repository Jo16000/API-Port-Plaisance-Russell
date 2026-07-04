const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({ message: "Compte agent créé." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Identifiants incorrects." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Identifiants incorrects." });

    // Génération du token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      "SECRET_KEY_PORT_RUSSELL",
      { expiresIn: "24h" }
    );

    // Enregistrement du Token dans un Cookie sécurisé pour le navigateur
    res.cookie("token", token, { httpOnly: true });

    // Si la demande vient du formulaire EJS, on redirige vers le dashboard
    if (req.body.fromForm || req.headers["content-type"] === "application/x-www-form-urlencoded") {
      return res.redirect("/dashboard");
    }

    res.json({ message: "Connexion réussie (API)", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};