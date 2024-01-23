import React from 'react'
import Image from 'next/legacy/image'
import styles from '../../styles/large_card.module.scss'

function LargeCard({img, title, description, buttonText, cta_position}) {



  return (
    <section className='relative py-16 cursor-pointer'>
         <div className='relative h-96 min-w-[300px]'>
            <Image 
                src={img}
                layout='fill'
                objectFit='cover'
                alt='Mallorca Ilustration'
            />
        </div>
        
        <div className={`absolute top-32 ${cta_position} bg-white p-5 rounded-2xl shadow-2xl ${styles.ctaDiv}`}
        >
            <h3 className='text-4xl mb-3'>{title}</h3>
            <p>{description}</p>
            <a 
               href={`https://wa.me/34671741577?text=Hola`}
               target="_blank"
               rel="noreferrer" 
            >
              <button className='text-sm lg:text-xl text-white bg-green-500 px-4 py-2 rounded-full shadow-md mt-5 w-full'>{buttonText}</button>
            </a>
        </div>
    </section>
  )
}

export default LargeCard
