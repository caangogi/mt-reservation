import React, {useEffect} from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckOutFom";
import GreatLoader from "../loaders/GreatLoader";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function App({amount, params}) {
  const [clientSecret, setClientSecret] = React.useState("");
  
  useEffect(() => {
    async function createPaymentIntent() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create-payment-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amount }),
        });

        if (!response.ok) {
          throw new Error('Error al crear el pago');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Ups, ha ocurrido un error al crear el pago.', error.message);
      }
    }

    createPaymentIntent();
  }, [amount]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm  params={params}/>
        </Elements>
      ) : (
        <div className="flex gap-2">
          <h3>Un momento...</h3>
          <GreatLoader />
        </div>
      )}
    </div>
  );
}