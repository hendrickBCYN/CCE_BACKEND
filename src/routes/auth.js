const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * POST /api/auth/google
 * Reçoit le credential Google, le vérifie, crée ou retrouvel'utilisateur en base, retourne un JWT applicatif.
*/
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Credential manquant" });
    }

    // Vérifier le token auprès de Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Créer ou retrouver l'utilisateur en base
    const [user] = await User.findOrCreate({
      where: { google_id: googleId },
      defaults: {
        google_id: googleId,
        email: email,
        display_name: name,
        avatar_url: picture,
        role: "viewer",
      },
    });

    // Mettre à jour les infos si elles ont changé
    await user.update({
      email: email,
      display_name: name,
      avatar_url: picture,
    });

    // Générer le JWT applicatif
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur auth Google:", error);
    res.status(401).json({ error: "Authentification échouée" });
  }
});

/**
 * GET /api/auth/verify
 * Vérifie le JWT et retourne les infos utilisateur.
*/
router.get("/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "Utilisateur introuvable" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ error: "Token invalide" });
  }
});

module.exports = router;