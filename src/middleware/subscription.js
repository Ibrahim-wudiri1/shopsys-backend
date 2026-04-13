import { prisma } from "../config/db.js";

// i will apply to other routes such as salesRoutes, product routes

export const checkSubscription = async (req, res, next) => {
  const user = req.user;

  const sub = await prisma.subscription.findUnique({
    where: { tenantId: user.tenantId },
  });

  if (!sub) {
    return res.status(403).json({ message: "No subscription found" });
  }

  // Allow active users
  if (sub.status === "active") return next();

  // Allow trial users if not expired
  if (sub.status === "trialing") {
    if (new Date() < new Date(sub.currentPeriodEnd)) {
      return next();
    }

    return res.status(403).json({
      message: "Trial expired. Please subscribe.",
    });
  }

  return res.status(403).json({
    message: "Subscription inactive",
  });
};