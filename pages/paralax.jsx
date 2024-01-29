import React from 'react';
import Section from '../components/sections/ParalaxSection'; // Crea este componente para representar cada sección
import Header from '../components/Header'
import BusesSection from '../components/home_sections/BusesSection'
const Paralax = () => {
  return (
    <div>
        <Header />
      {/* Sección 1 */}
      <Section
        title="Bienvenido a nuestro sitio"
        description="Descubre experiencias únicas de viaje."
        backgroundImage="url('/images/services_cards/08.png')"
      />

      {/* Sección 2 */}
      <Section
        /* title="Explora destinos increíbles"
        description="Encuentra el lugar perfecto para tus vacaciones." */
        /* backgroundImage="url('/images/services_cards/07.png')" */
      >

        <BusesSection />

      </Section>

      {/* Sección 3 */}
      <Section
        title="Reserva tu viaje ahora"
        description="Haz realidad tus sueños de viajar."
        backgroundImage="url('/images/services_cards/06.png')"
      />

      {/* Sección 4 */}
      <Section
        title="Ofertas especiales para ti"
        description="Aprovecha nuestras promociones exclusivas."
        /* backgroundImage="url('/images/services_cards/05.png')" */
      />

      {/* Sección 5 */}
      <Section
        title="Contacto y soporte"
        description="Estamos aquí para ayudarte. ¡Contáctanos!"
        backgroundImage="url('/images/services_cards/07.png')"
      />
    </div>
  );
};

export default Paralax