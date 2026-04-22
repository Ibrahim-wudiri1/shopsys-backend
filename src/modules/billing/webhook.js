import crypto from "crypto";
import { prisma } from "../../config/db.js";

const planCodeToLabel = {
  PLN_68pszny66jyelrp: "Monthly",
  PLN_xckemh2qcx82fq4: "Yearly",
};

const parsePaystackDate = (value) => {
  if (!value) return null;
  if (typeof value === "number") return new Date(value * 1000);
  if (/^\d+$/.test(String(value))) return new Date(Number(value) * 1000);
  return new Date(value);
};

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

    const planLabel =
      data.plan?.name ||
      planCodeToLabel[data.plan?.plan_code] ||
      (data.plan?.interval === "year" ? "Yearly" : data.plan?.interval === "month" ? "Monthly" : "Paid Plan");

    const currentPeriodEnd =
      parsePaystackDate(data.next_payment_date) ||
      parsePaystackDate(data.current_period_end) ||
      parsePaystackDate(data.next_schedule);

    await prisma.subscription.updateMany({
      where: {
        paystackCustomerId: data.customer.customer_code,
      },
      data: {
        paystackSubCode: data.subscription_code,
        paystackEmailToken: data.email_token,
        status: "active",
        plan: planLabel,
        currentPeriodEnd: currentPeriodEnd || undefined,
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