import React from 'react'
import Image from 'next/image'
import Logo from '../public/images/logo_02.png';
import Link from 'next/link';


function Footer() {
  return (
    <div className='flex flex-col justify-center items-center gap-y-10 py-14 bg-gray-100 text-gray-600'>
      <div className='space-y-4 text-xs text-gray-800'>
        <h5 className='font-bold'>SOBRE NOSOTROS</h5>
        <p>Como trabajamos en Mallorca Transfer</p>
        <p>Nuestros vehículos</p>
        <p>Mallorca Transfer Plus</p>
        <p>Mallorca Transfer Luxe</p>
      </div>
      <Link href={'/'}>
      <div 
          className='relative flex items-center gap-3 h-10 cursor-pointer my-auto'
      >
        <Image 
            src={Logo}
            width={50}
            height={50}
            alt='Mallorca Transfer Logo'
        />
        <div className='flex flex-col'>
          <p className='text-xl text-blue-app'>Mallorca Transfer</p>
          <span className='text-xs text-blue-app'>Big One For Groups</span>
        </div>
      </div>
      </Link>
    </div>
  )
}

export default Footer
