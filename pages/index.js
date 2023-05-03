import React from 'react'
import Head from 'next/head'
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import SmallCard from '../components/cards/SmallCard'
import MediumCard from '../components/cards/MediumCard'
import LargeCard from '../components/cards/LargeCard';

export default function Home({exploreData, cardsDate}) {
    
  return (
    <div className=''>
        <Head>
            <title>
                C4F Market Place
            </title>
        </Head> 

        <Header />
        <Banner />
        
        <main className='max-w-7xl mx-auto px-8 sm:px-16'>
            <section className='pt-6'>
                <h2 className='text-4xl font-semibold'>Explore Nearby</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                    {exploreData?.map((item, key) => (
                        <SmallCard key={key} img={item.img} location={item.location} distance={item.distance} />
                    ))}
                </div>
            </section>
            <section>
                <h2 className='text-4xl font-semibold'>Live anywhere</h2>
                <div className='flex space-x-3 overflow-scroll scrollbar-hide p-3 -ml-3'>
                    {cardsDate?.map((item, key) => (
                        <MediumCard 
                            key={key}
                            img={item.img}
                            title={item.title}
                        />
                    ))}
                </div>
            </section>

            <LargeCard 
                img='https://links.papareact.com/4cj'
                title='The Greatedt Outdoors'
                description="WishLists curated by Crowd4Flipping"
                buttonText='Get Inspired'
            />
        </main>
        
        <Footer 

        />

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