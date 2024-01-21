import React from 'react'
import {CardsData} from '../data/MediumCardsData'
import MediumCard from '../cards/MediumCard'

export default function PlacesSection() {
  return (
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
  )
}

