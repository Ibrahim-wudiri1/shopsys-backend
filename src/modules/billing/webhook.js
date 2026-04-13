import { prisma } from "../../config/db.js";

export const handlePaystackWebhook = async (req, res) => {
  const event = req.body;
  const hash = crypto
  .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
  .update(JSON.stringify(req.body))
  .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.sendStatus(401);
  }

  if (event.event === "subscription.create") {
    const data = event.data;

    await prisma.subscription.updateMany({
      where: {
        paystackCustomerId: data.customer.customer_code,
      },
      data: {
        paystackSubCode: data.subscription_code,
        paystackEmailToken: data.email_token,
        status: "active",
        plan: data.plan.name,
      },
    });
  }

  if (event.event === "invoice.payment_failed") {
    await prisma.subscription.updateMany({
      where: {
        paystackCustomerId: event.data.customer.customer_code,
      },
      data: {
        status: "inactive",
      },
    });
  }

  res.sendStatus(200);
};