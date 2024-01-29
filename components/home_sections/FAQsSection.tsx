import { useState } from 'react';

type FaqItemProps = {
  query: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
};

const FaqItem: React.FC<FaqItemProps> = ({ query, answer, isOpen, onClick }) => {
    return (
      <div className={`border-b ${isOpen ? 'bg-blue-app' : 'bg-white'} `}>
        <button
          className={`flex justify-between items-center md:items-start w-full py-3 px-4 ${isOpen ? 'text-white' : 'text-blue-app'}`}
          onClick={onClick}
        >
          <span className='text-left text-xl md:text-2xl'>{query}</span>
          <span className='text-xl md:text-2xl'>{isOpen ? '−' : '+'}</span>
        </button>
        {isOpen && <p className="py-2 px-4 text-black">{answer}</p>} {/* Texto en negro cuando está abierto */}
      </div>
    );
  };
  

const FaqSection: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const handleItemClick = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="w-full mx-auto my-8 shadow-lg rounded-lg">
        <h2 className='text-4xl mb-8'>Preguntas frecuentes</h2>
        <FaqItem
        query="¿Cómo reservo mi transporte en Mallorca?"
        answer="¡Reservar tu transporte es fácil y conveniente! Simplemente selecciona el servicio deseado en nuestra página web y completa el proceso de reserva con solo el 10% del total del precio. El resto lo puedes pagar el día del servicio. ¡Así de sencillo!"
        isOpen={openItem === 0}
        onClick={() => handleItemClick(0)}
        />
        <FaqItem
        query="¿Obtengo algún beneficio al reservar ida y vuelta?"
        answer="¡Por supuesto! Al reservar tus servicios de ida y vuelta con nosotros, disfrutarás de un 10% de descuento en el total del precio. Esta es nuestra manera de agradecerte por elegirnos para tus traslados en Mallorca, desde y hacia el aeropuerto."
        isOpen={openItem === 1}
        onClick={() => handleItemClick(1)}
        />
        <FaqItem
            query="¿Ofrecen servicios especiales para grupos grandes o eventos?"
            answer="Sí, contamos con una variedad de opciones para grupos grandes, incluyendo bodas, eventos corporativos y cenas. Nuestros buses y minibuses están equipados para brindar el máximo confort y eficiencia en tus eventos especiales."
               isOpen={openItem === 2}
        onClick={() => handleItemClick(2)}
        />
        <FaqItem
            query="¿Tienen opciones de transporte para ciclistas?"
            answer="Por supuesto, ofrecemos traslados especializados para ciclistas, incluyendo un remolque seguro para bicicletas. Así, puedes llevar tu equipo contigo de manera cómoda y segura a cualquier parte de la isla."
               isOpen={openItem === 3}
        onClick={() => handleItemClick(3)}
        />
        <FaqItem
            query="¿Puedo reservar un traslado desde mi finca hasta cualquier lugar de la isla?"
            answer="Claro, proporcionamos traslados desde fincas a cualquier destino en la isla. Disfruta de la comodidad y flexibilidad de nuestros servicios para explorar Mallorca a tu manera."
            isOpen={openItem === 4}
            onClick={() => handleItemClick(4)}
        />
        <FaqItem
            query="¿Qué pasa si necesito un servicio de transporte de último minuto?"
            answer="Entendemos que los planes pueden cambiar inesperadamente. Ofrecemos un servicio 'Last Minute' para atender tus necesidades urgentes de transporte. Simplemente contáctanos y haremos lo posible por acomodar tu solicitud."
               isOpen={openItem === 5}
        onClick={() => handleItemClick(5)}
        />
    </div>
  );
};

export default FaqSection;
