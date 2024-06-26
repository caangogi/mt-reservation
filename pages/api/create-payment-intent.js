// This is your test secret API key.
const stripe = require("stripe")(process.env.NEXT_STRIPE_SECRET_KEY);

const calculateOrderAmount = (amount) => {
  return amount * 100;
};

export default async function handler(req, res) {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(amount),
        currency: "eur",
        payment_method_types: [ 'card' ],
    });
    if(paymentIntent.client_secret){
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
   }
  } catch (error) {
    console.log('Ups, algo ha ido mal en createPaymentIntent', error)
  }

};