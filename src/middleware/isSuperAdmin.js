export function isSuperAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized: user not authenticated",
    });
  }

  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      message: "Forbidden: Super Admin access only",
    });
  }

  next();
}
