const sessionAuthMiddleware = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    next();
  } else {
    return res.status(401).json({ error: "Access Denied. Please login." });
  }
};

module.exports = sessionAuthMiddleware;
