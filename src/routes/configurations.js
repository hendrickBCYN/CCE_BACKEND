const express = require("express");
const authMiddleware = require("../middleware/auth");
const Configuration = require("../models/Configuration");

const router = express.Router();

// Toutes les routes sont protégées
router.use(authMiddleware);

/**
 * POST /api/configurations
 * Sauvegarder une nouvelle configuration.
*/
router.post("/", async (req, res) => {
  try {
    const { name, data } = req.body;

    if (!data) {
      return res.status(400).json({ error: "Données de configuration manquantes" });
    }

    const configuration = await Configuration.create({
      name: name || "Sans titre",
      data: data,
      user_id: req.userId,
    });

    res.status(201).json(configuration);
  } catch (error) {
    console.error("Erreur sauvegarde configuration:", error);
    res.status(500).json({ error: "Erreur lors de la sauvegarde" });
  }
});

/**
 * GET /api/configurations
 * Lister toutes les configurations de l'utilisateur connecté.
*/
router.get("/", async (req, res) => {
  try {
    const configurations = await Configuration.findAll({
      where: { user_id: req.userId },
      order: [["updated_at", "DESC"]],
      attributes: ["id", "name", "created_at", "updated_at"],
    });

    res.json(configurations);
  } catch (error) {
    console.error("Erreur listing configurations:", error);
    res.status(500).json({ error: "Erreur lors du chargement" });
  }
});

/**
 * GET /api/configurations/:id
 * Charger une configuration par son ID.
*/
router.get("/:id", async (req, res) => {
  try {
    const configuration = await Configuration.findOne({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    });

    if (!configuration) {
      return res.status(404).json({ error: "Configuration introuvable" });
    }

    res.json(configuration);
  } catch (error) {
    console.error("Erreur chargement configuration:", error);
    res.status(500).json({ error: "Erreur lors du chargement" });
  }
});

/**
 * DELETE /api/configurations/:id
 * Supprimer une configuration.
*/
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Configuration.destroy({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Configuration introuvable" });
    }

    res.json({ message: "Configuration supprimée" });
  } catch (error) {
    console.error("Erreur suppression configuration:", error);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

module.exports = router;