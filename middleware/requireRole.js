// middleware/requireRole.js -- new in Session 10

// Not a middleware itself: a function that BUILDS one.
// requireRole("admin") returns the (req, res, next) function
// that Express actually runs.
export default function requireRole(...allowed) {
  return (req, res, next) => {
    // verifyToken is what sets req.user, so it must run first
    if (!req.user) {
      return res.status(401).json({ error: "Log in first" });
    }

    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({
        error: `Only ${allowed.join(" or ")} may do this`,
      });
    }

    next();
  };
}
