import { prisma } from "../../config/db.js";

export const userShopService = {

  assignUsersToShop: async (tenantId, shopId, userIds) => {

    // check shop
    const shop = await prisma.shop.findFirst({
      where: { id: shopId, tenantId },
    });

    if (!shop) throw new Error("Shop not found");

    // delete existing assignments
    await prisma.userShop.deleteMany({
      where: { shopId },
    });

    // create new assignments
    const data = userIds.map(userId => ({
      userId,
      shopId,
    }));

    await prisma.userShop.createMany({ data });

    return { message: "Managers assigned successfully" };
  },

  getShopUsers: async (tenantId, shopId) => {

    return await prisma.userShop.findMany({
      where: {
        shopId,
        user: { tenantId },
      },
      include: {
        user: true,
      },
    });
  }

};