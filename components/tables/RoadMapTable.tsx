import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../services/FirebaseService';
import { RoadMapProps } from '../../backend/road-map/domain/types';
import { formatterEuro } from '../../utils/formatEur';
import toast from 'react-hot-toast';
import GreatLoader from '../loaders/GreatLoader';
import { generatePDF } from '../../utils/generatePdf';
import { InvoiceTemplate } from '../templates/InvoiceTemplate';
import { useAuth } from '../../context/auth';
import { BiSolidFilePdf } from "react-icons/bi";
import { GiRoad } from "react-icons/gi";
import { MdDeleteForever, MdOutlineEditRoad  } from "react-icons/md";
import EditInvoice from '../forms/EditInvoice';

interface RoadmapTableProps {
  roadmaps: RoadMapProps[];
}

const RoadmapTable: React.FC<RoadmapTableProps> = ({ roadmaps }) => {

  const {userProfile} = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [editableInvoiceId, setEditableInvoiceId] = useState<string | null>(null);
  const [newInvoiceNumber, setNewInvoiceNumber] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadMapProps>();

  const filteredRoadmaps = roadmaps.filter((roadmap) => {
    const clientName = `${roadmap.client.name} ${roadmap.client.lastName}`.toLowerCase();
    return clientName.includes(searchTerm.toLowerCase());
  })

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleInvoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    }
  };

  const handleDeleteButtonClick = (roadmap: RoadMapProps) => {
    setSelectedRoadmap(roadmap);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleDelete = async (roadMapId: string) => {
    setLoading(true)
    try {

      await db.collection('road-maps').doc(roadMapId).delete();
      await storage.ref(`invoices/${roadMapId}`).delete();

      toast.success('Factura eliminada correctamente');
      setLoading(false);
      handleModalClose();
    } catch (error) {
      toast.error('Ups, ha ocurrido algo inesperado. Intentalo nuevamente.')
      setLoading(false);
      console.error('Error al eliminar el elemento:', error);
    }
  };


  

  const handleEditButtonClick = (roadmap: RoadMapProps) => {
    setSelectedRoadmap(roadmap);
    setEditModalOpen(true); 
  }

  const handleEditModalClose = () => {
    setEditModalOpen(false);
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
            <th className="py-2 px-4 border text-start">Origen</th>
            <th className="py-2 px-4 border text-start">Destino</th>
            <th className="py-2 px-4 border text-start">Fecha</th>
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
              <>
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
                  <td className="py-2 px-4 border text-start">{roadmap.origin}</td>
                  <td className="py-2 px-4 border text-start">{roadmap.destination}</td>
                  <td className="py-2 px-4 border text-start">{date} / {time}</td>
                  <td className="py-2 px-4 border text-start">{roadmap.serviceType}</td>
                  <td className="py-2 px-4 border text-end">{roadmap.passengers}</td>
                  <td className="py-2 px-4 border text-end">{formatterEuro.format(roadmap.price)}</td>
                  <td className="py-2 px-2 border text-start flex justify-center gap-1 w-fit">

                    <div className=' flex flex-col justify-center text-center'>
                      <button
                          className="bg-red-600 hover:bg-red-400 text-white text-2xl font-bold p-1 rounded w-full flex justify-center"
                          onClick={() =>{
                              const invoiceTemplate = InvoiceTemplate(roadmap, userProfile);
                              generatePDF(invoiceTemplate)
                            }
                          }
                      >
                        <BiSolidFilePdf />

                      </button>
                      <p className=" text-xs ">Facturar</p>
                    </div>

                    <div className=' flex flex-col justify-center text-center'>
                        <a
                              href={roadmap.invoiceUrl}
                              target="_blank"
                              rel="noreferrer"
                          >
                              <button
                                  className=" bg-blue-600 hover:bg-blue-400 text-white text-2xl font-bold p-1 rounded w-full flex justify-center"
                              >
                                  <GiRoad />
                              </button>
                          </a>
                        <p className=" text-xs ">Ruta</p>
                    </div>

                    <div className=' flex flex-col justify-center text-center'>
                        <button
                            className=" bg-lime-500 hover:bg-lime-300 text-white text-2xl font-bold p-1 rounded w-full flex justify-center"
                            onClick={() => handleEditButtonClick(roadmap)}
                        >
                            <MdOutlineEditRoad />
                        </button>
                        <p className=" text-xs ">Editar</p>
                    </div>
                    
                    <div className=' flex flex-col justify-center text-center'>
                      <button
                            className="bg-red-600 hover:bg-red-400 text-white text-2xl font-bold p-1 rounded w-full flex justify-center"
                            onClick={() => handleDeleteButtonClick(roadmap)}
                        >
                          <MdDeleteForever />
                      </button>
                      <p className=" text-xs ">Eliminar</p>
                    </div>

                  </td>
                </tr>

                {isModalOpen && selectedRoadmap && (
                  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                    <div className="absolute bg-slate-500 opacity-75 w-full h-full"></div>
                    <div className="bg-white p-8 rounded shadow-lg z-10">
                      <p className="mb-4">Estas a punto de eliminar la factura <strong>Nº{selectedRoadmap.invoiceNumber}</strong> <br/> ¿Estás seguro que deseas continuar? </p>
                      {!loading ?
                        <>
                          <button
                            onClick={() => selectedRoadmap.id && handleDelete(selectedRoadmap.id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
                          >
                            Sí, eliminar
                          </button>
                          <button
                            onClick={handleModalClose}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Cancelar
                          </button>
                        </>
                      : 
                        <>
                          <p className="mb-4"> Estamos trabajando en ello, un momento...  </p>
                          <GreatLoader/>
                        </>
                      }
                    </div>
                  </div>
                )}

                {isEditModalOpen && selectedRoadmap && (
                  <div className="fixed top-0 left-0 w-full h-full flex items-start justify-center">
                    <div className="absolute bg-slate-500 opacity-75 w-full h-full" onClick={handleEditModalClose}></div>
                    <div className="bg-white p-8 rounded shadow-lg z-10 overflow-y-scroll h-full">
                      <EditInvoice 
                        formData={selectedRoadmap}
                      />
                    </div>
                  </div>
                )}
              </>
            )
          })}
        </tbody>
      </table>
      
    </div>
  );
};

export default RoadmapTable;
