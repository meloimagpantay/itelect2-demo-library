// middleware/verifyToken.js -- new in Session 10
import jwt from "jsonwebtoken";

// Runs BEFORE a route handler. Either it calls next() and the
// handler runs, or it answers 401 and the handler never runs.
export default function verifyToken(req, res, next) {
  const header = req.headers.authorization;

  // The header must read: Bearer <token>
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "No token. Send Authorization: Bearer <token>",
    });
  }

  const token = header.split(" ")[1];

  try {
    // Checks the signature and the expiry. Throws if either fails.
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    req.user = payload;
  } catch (err) {
    const message =
      err.name === "TokenExpiredError"
        ? "Token has expired. Log in again"
        : "Token is invalid";
    return res.status(401).json({ error: message });
  }

  next();
}
