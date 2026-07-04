const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Récupère le token soit depuis le Cookie (Navigateur) soit depuis l'en-tête (Postman)
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    // Si pas de token, on redirige vers l'accueil en passant un message d'erreur
    return res.status(401).render("index", { error: "Authentification requise. Veuillez vous connecter." });
  }

  try {
    // Vérification de la clé secrète
    const decoded = jwt.verify(token, "SECRET_KEY_PORT_RUSSELL");
    req.user = decoded; // Injecte les données décodées de l'utilisateur (username, email) dans la requête
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.status(400).redirect("/");
  }
};