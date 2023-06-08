import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LargeCard  from '../components/cards/LargeCard';
import { useRouter } from 'next/dist/client/router';

function Search({}) {

    const router = useRouter();
    const {location, startDate, endDate, noOfGuests, noOfBags} = router.query;
    const formattedStartDate = new Date(startDate).toLocaleString();
    const formattedEndDate = new Date(endDate).toLocaleString();
    const range = `${formattedStartDate} - ${formattedEndDate}`;

  return (
    <div className='h-screen'>
        <Header 
            placeholder={`${location}` } 
        />
        <main className='max-w-7xl mx-auto px-8 sm:px-16 flex flex-col gap-20'>
            <section className='flex-grow pt-14 px-6 min-h-fit'>
                
                <h1 className=''>Tu traslado a {location} desde el aeropuerto el {range} para {noOfGuests} pasajeros con {noOfBags} maletas</h1>
                

                {startDate === endDate ? 
                    (
                        <h1>
                            Tu traslado es solo de ida, reservando ida y regreso podrás tener un ahorro del 7%
                        </h1>
                    ) 
                    
                    :

                    (
                        <h1>Tu traslado es ida y regreso</h1>
                    )
                }

            </section>

            <LargeCard 
                img='https://links.papareact.com/4cj'
                title='¿Inquietudes? Contáctanos por WhatsApp'
                description="Contáctanos para resolver tus inquietudes"
                buttonText='Contáctanos por WhatsApp'
            />
        </main>
        <Footer />
    </div>
  )
}

export default Search; 