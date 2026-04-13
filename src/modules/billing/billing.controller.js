import { prisma } from "../../config/db.js";

import { paystack } from "../../config/paystack.js";

export const initializePayment = async (req, res) => {
  const user = req.user;
  const { planCode } = req.body;

  const subscription = await prisma.subscription.findUnique({
    where: { tenantId: user.tenantId },
  });

  const response = await paystack.post("/transaction/initialize", {
    email: user.email,
    plan: planCode,
    callback_url: `${process.env.FRONTEND_URL}/dashboard`,
  });

  res.json({ url: response.data.data.authorization_url });
};

export const createCheckoutSession = async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { tenant: true },
  });

  const subscription = await prisma.subscription.findUnique({
    where: { tenantId: user.tenantId },
  });

  const priceId = req.body.priceId;

 
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: subscription.stripeCustomerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],

     subscription_data: {
        trial_period_days: 14,
    },
    success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
  });

  res.json({ url: session.url });
};

export const createBillingPortal = async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const subscription = await prisma.subscription.findUnique({
    where: { tenantId: user.tenantId },
  });

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.FRONTEND_URL}/dashboard`,
  });

  res.json({ url: portalSession.url });
};