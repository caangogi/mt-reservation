import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { FaCcStripe } from 'react-icons/fa';
import { RiSecurePaymentLine } from 'react-icons/ri';
import toast from "react-hot-toast";
import {convertObjectToQueryString} from '../../utils/objectToQuery'
;
import GreatLoader from "../loaders/GreatLoader";

export default function CheckoutForm({params}) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  
  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
            toast.success()
            setMessage("Canal seguro cargado ");
          break;
        case "processing":
            toast.loading('Procesando')
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
            toast.error('Your payment was not successful, please try again.')
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
            toast.error('Ups, algo ha ido mal procesando tu pago, intentelo de nuevo.')
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const queryString = convertObjectToQueryString(params);
    const returnURL = baseURL + '/search/' + '?' + queryString

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error  } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${returnURL}`,
      },
    });

   

    await updateBookingState(bookingID)

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }
    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };


 


  return (
    <form id="payment-form" onSubmit={handleSubmit}>

      <PaymentElement id="payment-element" options={paymentElementOptions} />
        <div className='flex text-lg gap-2 items-center text-slate-700 mt-4'>
          <RiSecurePaymentLine className="text-2xl"/>
          <span>Pagos seguros </span>
          <FaCcStripe className="text-4xl text-purple-700"/>
        </div>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
      {!isLoading ? (
        <button 
        disabled={isLoading || !stripe || !elements} id="submit" 
        className='flex-grow text-green-500 border-2 border-green-500 rounded-full w-full p-2 mt-9 shadow-lg'
      >
        <span id="button-text" 
            
        >
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pagar ahora"}
        </span>
      </button>
      ) : (
        <GreatLoader />
      )}
     
    </form>
  );
}