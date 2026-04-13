import { prisma } from "../config/db.js";
import { getAccessibleShopIds } from "../utils/accessControl.js";

export const shopAccess = async (req, res, next) => {
  try {

    const shopId =
      req.params.shopId ||
      req.body.shopId ||
      req.query.shopId;

    if (!shopId) return next();

    const allowedShops = await getAccessibleShopIds(req.user, prisma);

    if (!allowedShops.includes(shopId)) {
      return res.status(403).json({
        message: "Access denied to this shop"
      });
    }

    next();

  } catch (err) {
    next(err);
  }
};