import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InfoCard from '../components/cards/InfoCard';
import { useRouter } from 'next/dist/client/router';
import {format} from 'date-fns'

function Search({}) {

    const router = useRouter();
    const {location, startDate, endDate, noOfGuests, noOfBags} = router.query;
    const formattedStartDate = format(new Date(startDate), "dd MMM yy");
    const formattedEndDate = format(new Date(endDate), "dd MMM yy");
    const range = `${formattedStartDate} - ${formattedEndDate}`;


  return (
    <div className='h-screen'>
        <Header 
            placeholder={`${location} | ${range} | ${noOfGuests} pasajeros` } 
        />
        <main className='flex'>
            <section className='flex-grow pt-14 px-6 min-h-screen'>
                <h1 className='text-3xl font-semibold '>Tu traslado a {location} desde el aeropuerto el {range} para {noOfGuests} pasajeros con {noOfBags} maletas</h1>
            </section>
        </main>
        <Footer />
    </div>
  )
}

export default Search;
