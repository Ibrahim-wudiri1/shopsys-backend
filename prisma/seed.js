import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "Demo Shopping Complex",
      logo: null,
    },
  });

  // Shop
  const shop = await prisma.shop.create({
    data: {
      name: "Main Branch",
      location: "Downtown",
      tenantId: tenant.id,
    },
  });

  // Admin User
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "wudiri@gmail.com",
      password: "wudiri",
      role: "ADMIN",
      tenantId: tenant.id,
    },
  });

  // Supplier
  const supplier = await prisma.supplier.create({
    data: {
      name: "Default Supplier",
      contact: "supplier1@example.com",
      tenantId: tenant.id,
    },
  });

  // Products
  await prisma.product.createMany({
    data: [
      {
        name: "Rice 50kg",
        sku: "RICE-50",
        category: "Food",
        costPrice: 40,
        sellingPrice: 55,
        quantity: 100,
        minimumStock: 10,
        tenantId: tenant.id,
        shopId: shop.id,
        supplierId: supplier.id,
      },
      {
        name: "Cooking Oil 5L",
        sku: "OIL-5L",
        category: "Food",
        costPrice: 20,
        sellingPrice: 30,
        quantity: 50,
        minimumStock: 5,
        tenantId: tenant.id,
        shopId: shop.id,
        supplierId: supplier.id,
      },
    ],
  });

  // Customer
  await prisma.customer.create({
    data: {
      name: "John Doe",
      phone: "08012345678",
      loyaltyPoints: 0,
      tenantId: tenant.id,
    },
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
