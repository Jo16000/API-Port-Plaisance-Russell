const Catway = require("../models/catwayModel");

exports.getAllCatways = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.json(catways);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCatwayById = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).json({ message: "Catway introuvable." });
    res.json(catway);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCatway = async (req, res) => {
  try {
    await Catway.create(req.body);
    if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
      return res.redirect("/views/catways");
    }
    res.status(201).json({ message: "Catway enregistré." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCatway = async (req, res) => {
  try {
    const updated = await Catway.findOneAndUpdate(
      { catwayNumber: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Catway introuvable." });

    if (req.headers["content-type"] === "application/x-www-form-urlencoded" || req.query._method === "PUT") {
      return res.redirect("/views/catways");
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCatway = async (req, res) => {
  try {
    const deleted = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Catway introuvable." });

    if (req.headers["content-type"] === "application/x-www-form-urlencoded" || req.query._method === "DELETE") {
      return res.redirect("/views/catways");
    }
    res.json({ message: "Catway supprimé." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};