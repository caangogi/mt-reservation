import Image from 'next/image';
import React from 'react';
import Logo from '../public/images/logo.svg'
import PalmaBanner from '../public/images/palma-de-mallorca.jpeg'

function Banner() {
  return (
    <div  className='relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]'>
        <Image 
            src={PalmaBanner}
            layout='fill'
            objectFit='cover'
            alt='Palma de Mallorca'
        />  
        <div className="absolute top-1/3 text-center w-full">
           <div className='backdrop-blur-md bg-white bg-opacity-10 py-10' >
            <h1 className='text-base md:text-4xl font-bold text-white'>
                Servicio de transporte y taslados en Mallorca para viajeros y grupos 
              </h1>
           </div>
        </div>  
    </div>
  )
}

export default Banner
