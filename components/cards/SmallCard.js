import React from 'react'
import Image from 'next/image'

function SmallCard({img, location, price}) {
  return (
    <div className='flex items-center m-2 mt-5 space-x-4 rounded-xl cursor-pointer hover:bg-gray-200 hover:scale-105 transition transform duration-200 ease-out'>
        <div className='relative h-16 w-16'>
            <Image 
                src={img}
                layout='fill'
                className='rounded-lg'
                alt={location}
            />
        </div>
        <div>
            <h2>{location}</h2>
        </div>
    </div>
  )
}

export default SmallCard
