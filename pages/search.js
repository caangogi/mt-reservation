import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LargeCard from '../components/cards/LargeCard';
import { useRouter } from 'next/dist/client/router';

function ConfirmationPage() {
  const router = useRouter();
  const { location, startDate, endDate, noOfGuests, noOfBags, price } = router.query;
  const formattedStartDate = new Date(startDate).toLocaleDateString();
  const formattedEndDate = new Date(endDate).toLocaleDateString();
  const range = `${formattedStartDate} - ${formattedEndDate}`;

  const isRoundTrip = startDate !== endDate;
  const savingsMessage = isRoundTrip
    ? 'Reservando ida y regreso podrás tener un ahorro del 10%'
    : '';

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Confirmación de Reserva - Tu Empresa de Transporte</title>
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
        <LargeCard
          img="https://links.papareact.com/4cj"
          title="¿Inquietudes? Contáctanos por WhatsApp"
          description="Estamos aquí para resolver tus inquietudes y proporcionarte el mejor servicio."
          buttonText="Contáctanos por WhatsApp"
        />
      </main>
      <Footer />
    </div>
  );
}

export default ConfirmationPage;
