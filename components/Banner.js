import Image from 'next/image'
import React from 'react'

function Banner() {
  return (
    <div  className='relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]'>
        <Image 
            src='https://links.papareact.com/0fm'
            layout='fill'
            objectFit='cover'
        />  
        <div className="absolute top-1/2 text-center w-full">
            <p className='text-sm sm:text-lg'>  No sure whre to go? Perfect. </p>
            <button className='text-white bg-blue-app px-10 py-4 shadow-md rounded-full font-bold my-3 hover:shadow-xl active:scale-90 transition duration-150'>I'm flexible</button>
        </div>  
    </div>
  )
}

export default Banner
