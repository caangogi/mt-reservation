import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import SmallCard from '../components/cards/SmallCard'
import MediumCard from '../components/cards/MediumCard'
import LargeCard from '../components/cards/LargeCard';
import WhatsAppButton from '../components/buttons/WhatsAppButton';
import {DataTransfer} from '../components/data/TarifasTransporte';
import {CardsData} from '../components/data/MediumCardsData'
import BusesSection from '../components/home_sections/BusesSection'
import ServicesSection from '../components/home_sections/ServicesSections'
import CTASection from '../components/home_sections/CTASection'
import ReservaSection from '../components/home_sections/ReservaSection'

export default function Home({exploreData, cardsDate}) {

    const [_cardsData, set_cardsData] = useState()

    useEffect(() =>{
        let combinedData = [];
        for (let i = 0; i < exploreData.length; i++) {
        combinedData.push({
            name: DataTransfer[i].name,
            img: exploreData[i].img,
            price: DataTransfer[i].values[0]
        });
        }
        set_cardsData(combinedData);
    }, []);

  return (
    <div>
        <Head>
            <title>Mallorca Transfer | Traslados desde y hacia el Aeropuerto</title>
            <meta name="description" content="Especialistas en transportes en Mallorca, ofrecemos traslados desde y hacia el aeropuerto para particulares y empresas. ¡Reserva ahora para un servicio rápido y eficiente!" />
        </Head> 

        <Header />
        <Banner />
        
        <main className='max-w-7xl mx-auto px-1 sm:px-16 md:px-1 lg:px-8 flex flex-col'>

            <BusesSection />

            <CTASection />

            <ServicesSection />

            <ReservaSection />
            
            <section>
                <h2 className='text-4xl font-semibold'>Lugares que visitar en Mallorca</h2>
                <div className='flex justify-between space-x-3 overflow-scroll scrollbar-hide p-3 -ml-3'>
                    {CardsData?.map((item, key) => {
                        if (key <= 2) return(
                            <MediumCard 
                                key={key}
                                img={item.image}
                                title={item.title}
                            />
                        )
                    })}
                </div>
            </section>

            <LargeCard 
                img='https://links.papareact.com/4cj'
                title='¿Inquietudes? Contáctanos por WhatsApp'
                description="Contáctanos para resolver tus inquietudes"
                buttonText='Contáctanos por WhatsApp'
            />

        </main>
        
        <Footer 

        />

        <WhatsAppButton/>

    </div>
  )
}


export async function getStaticProps() {
    const exploreData = await fetch("https://www.jsonkeeper.com/b/4G1G").then((res) => res.json());
    const cardsDate = await fetch("https://www.jsonkeeper.com/b/VHHT").then((res) => res.json())
    return {
        props:{
            exploreData,
            cardsDate
        },

    };
}