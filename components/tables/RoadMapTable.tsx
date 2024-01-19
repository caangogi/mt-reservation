import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/FirebaseService';
import { RoadMapProps } from '../../backend/road-map/domain/types';
import { formatterEuro } from '../../utils/formatEur';
import toast from 'react-hot-toast';
import GreatLoader from '../loaders/GreatLoader';
import { generatePDF } from '../../utils/generatePdf';
import { InvoiceTemplate } from '../templates/InvoiceTemplate';
import { useAuth } from '../../context/auth';

interface RoadmapTableProps {
  roadmaps: RoadMapProps[];
}

const RoadmapTable: React.FC<RoadmapTableProps> = ({ roadmaps }) => {

  const {userProfile} = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [editableInvoiceId, setEditableInvoiceId] = useState<string | null>(null);
  const [newInvoiceNumber, setNewInvoiceNumber] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false)
  const filteredRoadmaps = roadmaps.filter((roadmap) => {
    const clientName = `${roadmap.client.name} ${roadmap.client.lastName}`.toLowerCase();
    return clientName.includes(searchTerm.toLowerCase());
  })

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleInvoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Aquí puedes manejar la lógica para actualizar el valor de la factura en tu estado o realizar una acción de actualización.
   /*  console.log(`Nuevo valor de factura: ${event.target.value}`); */
   setNewInvoiceNumber(event.target.value)
  };
  const handleInvoiceClick = (invoiceId: any, invoiceNumber: any) => {
    setNewInvoiceNumber(invoiceNumber)
    setEditableInvoiceId(invoiceId);
  };

  const updateInvoiceNumber = async (roadMapId: any, newInvoiceNumber: any) => {
    if(newInvoiceNumber === '') return toast.error('Escribe un nuevo número de factura');
    setLoading(true);
    try {
      const roadMapRef = doc(db, 'road-maps', roadMapId);
      await updateDoc(roadMapRef, { invoiceNumber: newInvoiceNumber });
      setEditableInvoiceId(null);
      setNewInvoiceNumber("")
      toast.success('Factura actualizada');
      setLoading(false);
    } catch (error) {
      toast.error('Ups, algo ha ido mal. Intentalo de nuevo.')
      setLoading(false);
      console.error('Error al actualizar el número de factura:', error);
      // Manejar el error de alguna manera
    }
  };

  return (
      <div className="overflow-x-auto">
        <div className="mb-4">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Buscar por nombre de cliente"
            className="p-2 border border-gray-300 w-72"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border text-start">Factura</th>
            <th className="py-2 px-4 border text-start">Nombre</th>
            <th className="py-2 px-4 border text-start">Fecha</th>
            <th className="py-2 px-4 border text-start">Hora</th>
            <th className="py-2 px-4 border text-start">Origen</th>
            <th className="py-2 px-4 border text-start">Destino</th>
            <th className="py-2 px-4 border text-start">Servicio</th>
            <th className="py-2 px-4 border text-start">Pasajeros</th>
            <th className="py-2 px-4 border text-start flex justify-between">Precio</th>
            <th className="py-2 px-4 border text-start">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoadmaps.map((roadmap) => {
            
            const timestamp = roadmap.date instanceof Date
            ? roadmap.date
            : new Date(roadmap.date.seconds * 1000 + (roadmap.date.nanoseconds || 0) / 1e6);

            const date = timestamp.toLocaleDateString();
            const time = timestamp.toLocaleTimeString();
            return(
            <tr key={roadmap.id}>
              <td className="py-2 px-4 border text-start">
                  {editableInvoiceId === roadmap.id ? (
                    <div className='flex flex-col'> 
                      <div className='flex justify-around'>
                        <input
                          type="text"
                          value={editableInvoiceId === null ? roadmap.invoiceNumber : newInvoiceNumber }
                          onChange={handleInvoiceChange}
                        />
                        <span 
                          className='cursor-pointer border p-1 text-red-600 rounded-full bg-red-200 hover:bg-red-600 hover:text-red-50'
                          onClick={() => setEditableInvoiceId(null)}
                        >
                          X
                        </span>
                      </div>

                      {loading ?
                        <div
                          className=" bg-green-400 hover:bg-green-500 text-white font-bold py-1 px-4 rounded-md w-full mt-1"
                        >
                          <GreatLoader />
                        </div> 
                      : 
                      <button
                        className=" bg-green-400 hover:bg-green-500 text-white font-bold py-1 px-4 rounded-md w-full mt-1"
                        onClick={() => updateInvoiceNumber(roadmap.id, newInvoiceNumber)}
                      >
                        Actualizar
                      </button> 
                      }
                    </div>
                  ) : (
                    <span
                      className="cursor-pointer"
                      onClick={() => handleInvoiceClick(roadmap.id, roadmap.invoiceNumber)}
                    >
                      {roadmap.invoiceNumber}
                    </span>
                  )}
              </td>
              <td className="py-2 px-4 border text-start">{`${roadmap.client.name} ${roadmap.client.lastName}`}</td>
              <td className="py-2 px-4 border text-start">{date}</td>
              <td className="py-2 px-4 border text-start">{time}</td>
              <td className="py-2 px-4 border text-start">{roadmap.origin}</td>
              <td className="py-2 px-4 border text-start">{roadmap.destination}</td>
              <td className="py-2 px-4 border text-start">{roadmap.serviceType}</td>
              <td className="py-2 px-4 border text-end">{roadmap.passengers}</td>
              <td className="py-2 px-4 border text-end">{formatterEuro.format(roadmap.price)}</td>
              <td className="py-2 px-2 border text-start flex justify-center gap-1 w-fit">

              <button
                    className="bg-red-400 hover:bg-red-600 text-white font-bold p-1 rounded-md w-fit"
                    onClick={() =>{
                        const invoiceTemplate = InvoiceTemplate(roadmap, userProfile);
                        generatePDF(invoiceTemplate)
                      }
                    }
                >
                  Facturar
                </button>
                <a
                    href={roadmap.invoiceUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    <button
                        className=" bg-blue-600 hover:bg-blue-400 text-white font-bold p-1 rounded-md w-fit"
                    >
                        Hoja de ruta
                    </button>
                </a>
              </td>
            </tr>
            )
          } )}
        </tbody>
      </table>
    </div>
  );
};

export default RoadmapTable;
