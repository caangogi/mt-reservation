import React from 'react';
import LargeCard from '../cards/LargeCard';

const ContactCTASection = () => {
  return (
    <LargeCard 
        img='/images/call_to_action_image.png'
        title='¿Inquietudes? Contáctanos por WhatsApp'
        description="Contáctanos para resolver tus inquietudes"
        buttonText='Contáctanos por WhatsApp'
        cta_position='right-12'
    />
  );
};

export default ContactCTASection;