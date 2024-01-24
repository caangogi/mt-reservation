import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LargeCard from '../components/cards/LargeCard';
import { useRouter } from 'next/dist/client/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/FirebaseService';
import toast from 'react-hot-toast';

function ConfirmationPage() {
  const router = useRouter();
  const { location, startDate, endDate, noOfGuests, noOfBags, price, bookingID, payment_intent_client_secret } = router.query;
  const formattedStartDate = new Date(startDate).toLocaleDateString();
  const formattedEndDate = new Date(endDate).toLocaleDateString();
  const range = `${formattedStartDate} - ${formattedEndDate}`;

  const isRoundTrip = startDate !== endDate;
  const savingsMessage = isRoundTrip
    ? 'Reservando ida y regreso podrás tener un ahorro del 10%'
    : '';


    useEffect(() => {
        if(!bookingID) return
        updateBookingState(bookingID, payment_intent_client_secret)
    }, [bookingID])

    const updateBookingState = async (bookingID, payment_intent_client_secret) => {
      try {
        const bookingRef = doc(db, 'bookings', bookingID);
        const bookingDoc = await getDoc(bookingRef);
        if(bookingDoc.data().payment.confirmed) return toast.success('la reserva ya esta completada')
        await updateDoc(bookingRef, {
          ...bookingDoc.data(),
          payment: {
            ...bookingDoc.data().payment,
            confirmed: true,
            paymentID: payment_intent_client_secret
          }
        });
    
        toast.success('Tu reserva ha sido completada con éxito. ');
      } catch (error) {
        toast.error('Ups, algo ha ido mal. Inténtalo de nuevo.');
        console.error('Error al actualizar el estado de reserva:', error);
      }
    };

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Confirmación de Reserva - Mallorca Transfer</title>
        <meta
          name="description"
          content={`Tu confirmación de reserva para traslado a ${location} desde el aeropuerto. Detalles: ${range}, ${noOfGuests} pasajeros, ${noOfBags} maletas.`}
        />
        <meta
          name="keywords"
          content="confirmación de reserva, traslado, transporte, servicio de transporte, viaje"
        />
      </Head>
      <Header placeholder={location} />
      <main className="max-w-7xl mx-auto px-8 sm:px-16 flex-grow pt-[25vh]">
        <section className="flex flex-col gap-6 items-center text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Confirmación de Reserva
          </h1>
          <p className="text-lg">
            Tu traslado a {location} desde el aeropuerto el {range} para {noOfGuests} pasajeros
            con {noOfBags} maletas.
          </p>
          {isRoundTrip && (
            <p className="text-lg text-green-500 font-semibold">{savingsMessage}</p>
          )}
        </section>
    </main>
    <LargeCard
        img="/images/services_cards/07.png"
        title="Tu serva esta lista."
        description="Muchas gracias por confianr en Mallorca Transfer, su servicio de transporte confiable en Mallorca. Si necesitas ayuda con tu reserva puedes contactar a tráves de WhatsApp."
        buttonText="Contáctanos por WhatsApp"
        cta_position='right-40'
      />
      <Footer />
    </div>
  );
}

export default ConfirmationPage;
