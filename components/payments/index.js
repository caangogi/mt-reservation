import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckOutFom";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function App({amount}) {
  const [clientSecret, setClientSecret] = React.useState("");

  React.useEffect(() => {
    // Create PaymentIntent as soon as the page loads
   /*  if(!clientSecret) return */
    async function createPaymentIntent (){
      try {
        fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({amount: amount}),
        })
          .then((res) => {
            console.log(res)
            res.json()
          })
          .then((data) => setClientSecret(data.clientSecret));
      } catch (error) {
          console.log('Ups, ha ocurrido un error al crear el pago.', error)
      }
    }
    createPaymentIntent()
  }, [CheckoutForm]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}