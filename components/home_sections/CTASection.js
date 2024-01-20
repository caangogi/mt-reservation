import React from 'react';

const ContactCTASection = () => {
  return (
    <section className="bg-blue-app text-white py-16 rounded-lg shadow-md">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">¿Necesitas algo más personalizado? ¡No dudes en contactarnos!</h2>
        <p className="text-lg mb-8">
          Descubre la comodidad y elegancia de nuestros buses. ¡No esperes más para planificar tu próximo viaje inolvidable!
        </p>
        <div className="flex justify-center flex-col md:flex-row gap-2 p-3">
          <a
            href={`https://wa.me/34671741577?text=Hola`}
            target="_blank"
            rel="noopener noreferrer"
            className='text-sm lg:text-xl text-white bg-green-wapp px-4 py-2 rounded-lg mt-5 shadow-md'
          >
            Prefiero WhatsApp
          </a>
          <a
            href="tel:671741577"
            className='text-sm lg:text-xl text-white bg-cyan-900 px-4 py-2 rounded-lg mt-5 shadow-md'
          >
            Prefiero Llamar
          </a>
          <a
            href="mailto:santiagosbus@gmail.com"
            className='text-sm lg:text-xl text-white bg-red-600 px-4 py-2 rounded-lg mt-5 shadow-md'
          >
            Correo Electrónico
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactCTASection;