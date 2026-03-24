const authMiddleware = require("../middleware/auth");

describe("Middleware auth : token missing", () => {
  it("Returns a 401 status code if the Authorization header is missing", () => {
    // Mock an HTTP request without an “Authorization” header 
    const req = {
      headers: {},    
    };

    // Mock the Express response object
    const res = {
      status: jest.fn().mockReturnThis(),  
      json: jest.fn(),                      
    };

    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token manquant" });
    expect(next).not.toHaveBeenCalled();
  });
});