import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InfoCard from '../components/cards/InfoCard';
import { useRouter } from 'next/dist/client/router';
import {format} from 'date-fns'

function Search({searchResults}) {

    const router = useRouter();
    const {location, startDate, endDate, noOfGuests} = router.query;
    const formattedStartDate = format(new Date(startDate), "dd MMM yy");
    const formattedEndDate = format(new Date(endDate), "dd MMM yy");
    const range = `${formattedStartDate} - ${formattedEndDate}`;

    console.log(searchResults)

  return (
    <div className='h-screen'>
        <Header 
            placeholder={`${location} | ${range} | ${noOfGuests} huespedes` } 
        />
        <main className='flex'>
            <section className='flex-grow pt-14 px-6'>
                <p>300+ Stays {range} for  {noOfGuests} Guests</p>
                <h1 className='text-3xl font-semibold '>Stays in {location}</h1>
                <div className='hidden lg:inline-flex mb-5 space-x-3 text-gray-800'>
                    <p className='button'>Cancelation flexibility</p>
                    <p className='button'>type of place</p>
                    <p className='button'>Price</p>
                    <p className='button'>More filters</p>
                </div>
                <div>
                    {searchResults?.map((item, key) => (
                        <InfoCard 
                            key={key}
                            img={item.img}
                            location={item.location}
                            title={item.title}
                            description={item.description}
                            star={item.star}
                            price={item.price}
                            total={item.total}
                        /> 
                    ))}
                </div>
            </section>
        </main>
        <Footer />
    </div>
  )
}

export default Search;

export async function getServerSideProps() {
    const searchResults = await fetch('https://www.jsonkeeper.com/b/5NPS').then((res) => res.json());

    return{
        props: {
           searchResults 
        }
    }

}
