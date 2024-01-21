import React from 'react'
import { buses } from '../data/BusesData'
import Image from 'next/image'

export default function BusesSection({setToBooking}) {
  return (
    <>
        {/* Desktop */}
        <section className="py-16 bg-white hidden md:block">
            <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8">Descubre Nuestra Flota de Buses</h2>
            {buses.map((bus, index) => (
                <div
                key={index}
                className={`flex bg-white rounded-lg overflow-hidden shadow-lg mb-16 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                <Image src={bus.imageUrl} alt={bus.name} width={640} height={400} objectFit="cover" className="w-1/2" />
                <div className="p-6 w-1/2">
                    <h3 className="text-2xl font-bold mb-3">{bus.name}</h3>
                    <p className="text-gray-600">{bus.description}</p>
                    <button 
                        className="mt-4 bg-blue-app text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-blue-700 md:w-[50%]"
                        onClick={() => setToBooking(true)}
                    >
                    ¡Reserva Ahora!
                    </button>
                </div>
                </div>
            ))}
            </div>
        </section>

        {/* Mobile */}
        <section className="py-16 bg-white block md:hidden">
            <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8">Nuestras Unidades</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {buses.map((bus, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                    <Image src={bus.imageUrl} alt={bus.name} width={640} height={400} objectFit="cover" className="w-full rounded-md" />
                    <h3 className="text-2xl font-bold mb-4">{bus.name}</h3>
                    <p className="text-gray-600">{bus.description}</p>
                    <button 
                        className="mt-4 bg-blue-app text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-blue-700 w-full"
                        onClick={() => setToBooking(true)}
                    >
                    ¡Reserva Ahora!
                    </button>
                </div>
                ))}
            </div>
            </div>
        </section>
        </>
  )
}
