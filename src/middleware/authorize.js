export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: `Access denied for role: ${user.role}`,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};