export const tenantGuard = (req, res, next) => {
  if (!req.user || !req.user.tenantId) {
    return res.status(403).json({ message: "Tenant access denied" });
  }
  req.tenantId = req.user.tenantId;
  next();
};
