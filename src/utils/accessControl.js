export const getAccessibleShopIds = async (user, prisma) => {

  // ADMIN → all shops
  if (user.role === "TENANT_ADMIN") {
    const shops = await prisma.shop.findMany({
      where: { tenantId: user.tenantId },
      select: { id: true }
    });

    return shops.map(s => s.id);
  }

  // MANAGER → from UserShop
  if (user.role === "MANAGER") {
    const userShops = await prisma.userShop.findMany({
      where: { userId: user.id },
      select: { shopId: true }
    });

    return userShops.map(us => us.shopId);
  }

  // CASHIER → single shop
  if (user.role === "CASHIER") {
    return user.shopId ? [user.shopId] : [];
  }

  return [];
};