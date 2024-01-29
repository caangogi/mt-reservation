// Section.js
import React, { useState, useEffect } from 'react';

const Section = ({ title, description, backgroundImage, children }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const parallaxStyle = {
    backgroundPositionY: `${offset * 0.5}px`,
    backgroundSize: 'cover'
  };

  const textStyles = {
    transform: `translateY(${-200}px)`, // Ajusta el valor según sea necesario
  };



  return (
    <section
      className="h-screen flex items-center justify-center text-white relative overflow-hidden"
      style={{ backgroundImage: `${backgroundImage}`, ...parallaxStyle }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="text-center z-10" style={textStyles}>
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg">{description}</p>
      </div>
      {children}
    </section>
  );
};

export default Section;
