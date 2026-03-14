const jwt = require("jsonwebtoken");

/**
 * Middleware qui vérifie le JWT dans le header Authorization.
 * Si valide → ajoute req.userId et passe au suivant.
 * Si invalide → retourne 401.
*/
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token invalide ou expiré" });
  }
}

module.exports = authMiddleware;
