const authMiddleware = require("../middleware/auth");

describe("Middleware auth : token absent", () => {
  it("retourne 401 si le header Authorization est manquant", () => {
    // ── Arrange : simuler req, res, next ──────────────────
    const req = {
      headers: {},    // pas de header Authorization
    };

    const res = {
      status: jest.fn().mockReturnThis(),  // res.status(401) retourne res
      json: jest.fn(),                      // res.json({ error: ... })
    };

    const next = jest.fn();

    // ── Act : appeler le middleware ────────────────────────
    authMiddleware(req, res, next);

    // ── Assert : vérifications ────────────────────────────
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token manquant" });
    expect(next).not.toHaveBeenCalled();
  });
});