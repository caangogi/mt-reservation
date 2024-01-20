import React, { useState } from 'react';

const ReservaSection = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="py-12 bg-gray-100 text-center mb-8">
      <div className="container mx-auto">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded"
          onClick={openModal}
        >
          Reservar
        </button>
        {modalOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
            <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>
            <div className="z-10 bg-white p-8 rounded shadow-md">
              <h2 className="text-2xl font-bold mb-4">¡Reserva Exitosa!</h2>
              <p>Tu reserva ha sido confirmada. ¡Esperamos que disfrutes tu viaje!</p>
              <button
                className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReservaSection;
