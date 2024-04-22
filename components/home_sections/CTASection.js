import React from 'react';
import LargeCard from '../cards/LargeCard';

const ContactCTASection = () => {
  return (
    <LargeCard 
        img='/images/call_to_action_image.png'
        title='Para otros traslados consultanos vía WhatsApp'
        description="Contáctanos para resolver tus inquietudes"
        buttonText='Reserva por WhatsApp'
        cta_position='right-40'
    />
  );
};

export default ContactCTASection;