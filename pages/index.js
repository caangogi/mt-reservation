import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import LargeCard from '../components/cards/LargeCard';
import WhatsAppButton from '../components/buttons/WhatsAppButton';
import BusesSection from '../components/home_sections/BusesSection'
import ServicesSection from '../components/home_sections/ServicesSections'
import CTASection from '../components/home_sections/CTASection'
import ReservaSection from '../components/home_sections/ReservaSection'
import PlacesSection from '../components/home_sections/PlacesSection'

export default function Home() {

  const [toBooking, setToBooking] = useState(false)

  return (
    <div>
        <Head>
            <title>Mallorca Transfer | Traslados desde y hacia el Aeropuerto</title>
            <meta name="description" content="Especialistas en transportes en Mallorca, ofrecemos traslados desde y hacia el aeropuerto para particulares y empresas. ¡Reserva ahora para un servicio rápido y eficiente!" />
        </Head> 

        <Header 
          toBooking={toBooking}
          setToBooking={setToBooking}
        />
        
        <Banner />
        
        <main className='max-w-7xl mx-auto px-1 sm:px-16 md:px-1 lg:px-8 flex flex-col'>


            <BusesSection
              setToBooking={setToBooking}
            />

            <CTASection />

            <ServicesSection />

            <ReservaSection 
            />

            <PlacesSection />
            
            <LargeCard 
                img='/images/large_card_image.webp'
                title='¿Inquietudes? Contáctanos por WhatsApp'
                description="Contáctanos para resolver tus inquietudes"
                buttonText='Contáctanos por WhatsApp'
                cta_position='left-12'
            />

        </main>
        
        <Footer 

        />

        <WhatsAppButton/>

    </div>
  )
}

