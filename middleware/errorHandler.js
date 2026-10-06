// middleware/errorHandler.js -- new in Session 11.
// The same four-parameter function that sat at the bottom of server.js
// in Sessions 6, 9 and 10, moved into the folder for middleware.

// Four parameters (err, req, res, next) are what make Express treat this
// as an error handler rather than an ordinary middleware.
export default function errorHandler(err, req, res, next) {
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({ error: err.errors.map((e) => e.message) });
  }
  // Session 9: the unique index on Users.email refused a duplicate.
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ error: "That email is already registered" });
  }
  // Session 10: a 4xx raised by Express itself -- for example
  // express.json() refusing a body that is not valid JSON.
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }
  // Session 10: the real message goes to the terminal, for you.
  // The client gets one sentence that reveals nothing inside.
  console.error(err.message);
  res.status(500).json({ error: "Something went wrong on the server" });
}
