// This is your test secret API key.
const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const calculateOrderAmount = (amount) => {
  return amount * 100;
};

export default async function handler(req, res) {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(amount),
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });

};