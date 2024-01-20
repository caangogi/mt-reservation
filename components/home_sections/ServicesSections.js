import React from 'react'
import { services } from '../data/ServicesData'

export default function ServicesSections() {
  return (
    <section className="py-16 bg-white">
        <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8">Nuestros Servicios de Transporte</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <img src={service.imageUrl} alt={service.title} className="mb-4 h-32 w-full object-cover rounded-md" />
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
                </div>
            ))}
            </div>
        </div>
    </section>

  )
}
