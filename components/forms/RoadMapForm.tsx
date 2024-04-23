import React, {useState} from 'react';
import { useRoadmaps } from '../../context/RoadMapsContext';
import { RoadMap } from "../../backend/road-map/aplication/Roadmap";
import { RoadMapProps } from "../../backend/road-map/domain/types"; 
import { User } from '../../backend/share/types';
import { v4 as uuidv4 } from 'uuid'
import { municipios } from '../data/MarllorcaMunicipios';
import GreatLoader from '../loaders/GreatLoader';
import { useAuth } from '../../context/auth';
import { RoadMapTemplate } from '../templates/RoadMapTemplate';
import { generatePDF } from '../../utils/generatePdf';
import { uploadPdfToStorage } from '../../utils/uploadPdfToStorage';

import toast from 'react-hot-toast';

const RoadMapForm = () => {
  const { currentUser, userProfile } = useAuth();
  const { lastInvoiceNumber } = useRoadmaps();

  console.log('lastInvoiceNumber:', lastInvoiceNumber);

  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<RoadMapProps>({
    id: uuidv4(),
    client: {
      name: '',
      lastName: '',
      documentType: '',
      documentID: '',
      address: '',
      phone: '',
      email: '',
      type: 'guest'
    },
    date: new Date(),
    origin: '',
    destination: '',
    serviceType: '',
    contractedService: '',
    passengers: 0,
    price: 0,
    paymentMethod: "",
    driverId: currentUser?.uid,
    vehicle: '',
    invoiceNumber: "",
    invoiceUrl: "",
    observations: ""  
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof User
  ) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      client: {
        ...formData.client,
        [field]: value,
      },
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      
      const roadMapInstance = new RoadMap();

      const invoiceNumber = lastInvoiceNumber 
      ? `INV-${String(parseInt(lastInvoiceNumber.split('-')[1]) + 1).padStart(5, '0')}`
      : 'INV-00001';

      const roadMapTemplate = RoadMapTemplate({...formData, invoiceNumber}, userProfile);
      const pdf = await generatePDF(roadMapTemplate)
      const url: any = await uploadPdfToStorage(pdf, formData.id)

      await roadMapInstance.create({
        ...formData, 
        invoiceNumber, 
        id: formData.id, 
        invoiceUrl: url
      });

      setFormData({
        id: '', 
        client: {
          name: '',
          lastName: '',
          documentType: '',
          documentID: '',
          address: '',
          phone: '',
          email: '',
          type: 'guest',
        },
        date: new Date(),
        origin: '',
        destination: '',
        serviceType: '',
        contractedService: '',
        passengers: 0,
        paymentMethod: '',
        price: 0,
        driverId: currentUser?.uid,
        vehicle: '',
        invoiceNumber: "",
        invoiceUrl: '',
        observations: ''
      });

      setLoading(false);
      toast.success('Hoja de ruta creada correctamente')

    } catch (error) {
      setLoading(false);
      toast.error('ups, algo ha ido mal. Intentelo nuevamente')
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-4xl p-6 bg-white rounded-md shadow-lg flex flex-col gap-3"
    >
      <div className="mb-4">
        <h1 className="text-gray-700 text-lg font-bold ">Hoja de ruta</h1>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className='border p-4 rounded-md'>
          <div className="mb-4">
            <h2 className="text-gray-700 text-lg font-bold ">Datos del cliente</h2>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre:
            </label>
            <input
              type="text"
              name="name"
              value={formData.client.name}
              onChange={(e) => handleClientChange(e, 'name')}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Apellido:
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.client.lastName}
              onChange={(e) => handleClientChange(e, 'lastName')}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
      
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tipo de documento:
            </label>
            <input
              type="text"
              name="documentType"
              value={formData.client.documentType}
              onChange={(e) => handleClientChange(e, 'documentType')}
              className="w-full px-3 py-2 border rounded-md"
            />
            <datalist id='documentType'>
                <option value="DNI"></option>
                <option value="NIE"></option>
                <option value="PASAPORTE"></option>
              </datalist>
          </div>
    
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Número de documento:
            </label>
            <input
              type="text"
              name="documentID"
              value={formData.client.documentID}
              onChange={(e) => handleClientChange(e, 'documentID')}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
      
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Dirección:
            </label>
            <input
              type="text"
              name="address"
              value={formData.client.address}
              onChange={(e) => handleClientChange(e, 'address')}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Teléfono:
            </label>
            <input
              type="text"
              name="phone"
              value={formData.client.phone}
              onChange={(e) => handleClientChange(e, 'phone')}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.client.email}
              onChange={(e) => handleClientChange(e, 'email')}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

        </div>

        <div className='border p-4 rounded-md'>
          <div className="mb-4">
            <h2 className="text-gray-700 text-lg font-bold ">Datos del servicio</h2>
          </div>
          <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Origen:
          </label>
          <input
            id='origin'
            type="text"
            name="origin"
            list="municipiosOrigenList"
            value={formData.origin}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          <datalist id='municipiosOrigenList'>
            {municipios.map((item) => <option key={item} value={item}> {item} </option>)}
          </datalist>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Destino:
            </label>
            <input
              id="destination"
              type="text"
              name="destination"
              list="municipiosDestinoList"
              value={formData.destination}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
            <datalist id='municipiosDestinoList'>
              {municipios.map((item) => <option key={item} value={item}> {item} </option>)}
            </datalist>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Servicio contratado
            </label>
            <input
              type="text"
              name="contractedService"
              list='contractedService'
              value={formData.contractedService}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
            <datalist id='contractedService'>
                <option value="Traslado"></option>
                <option value="Excursión"></option>
                <option value="Disponibilidad"></option>
              </datalist>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tipo de servicio:
            </label>
            <input
              type="text"
              name="serviceType"
              list='serviceTypes'
              value={formData.serviceType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
            <datalist id='serviceTypes'>
                <option value="SD"></option>
                <option value="DR"></option>
                <option value="SPREG"></option>
                <option value="TUR"></option>
            </datalist>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Número de pasajeros:
            </label>
            <input
              type="number"
              name="passengers"
              inputMode="numeric"
              value={formData.passengers}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Metodo de pago
            </label>
            <input
              type="text"
              name="paymentMethod"
              list='paymentMethods'
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
            <datalist id='paymentMethods'>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia bancaria">Transferencia bancaria</option>
            </datalist>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Precio:
            </label>
            <input
              type="number"
              name="price"
              inputMode="numeric"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Vehículo:
              </label>
              <input
                name="vehicle"
                type='text'
                list='vehicles'
                value={formData.vehicle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
              <datalist id='vehicles'>
                <option value="7788DTM">7788DTM</option>
                <option value="0774HKP">0774HKP</option>
                <option value="5817FTT">5817FTT</option>
              </datalist>
          </div>
          <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Observaciones:
              </label>
              <textarea
                name="observations"
                inputMode="numeric"
                value={formData.observations}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
          </div>
        </div>
      </div>
      

      
      <div className="flex justify-center">
        {!loading ? 
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full"
          >
            Guardar hoja de ruta
          </button>
        :
          <div
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex justify-center w-full"
          >
            un momento...
            <GreatLoader />
          </div>
        }
      </div>
    </form>
  );
};

export default RoadMapForm;