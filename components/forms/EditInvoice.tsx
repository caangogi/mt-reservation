import React, {useState} from 'react'
import { RoadMap } from "../../backend/road-map/aplication/Roadmap";
import { RoadMapProps } from "../../backend/road-map/domain/types"; 
import { User } from '../../backend/share/types';
import { v4 as uuidv4 } from 'uuid'
import { municipios } from '../data/MarllorcaMunicipios';
import GreatLoader from '../loaders/GreatLoader';
import { useAuth } from '../../context/auth';
import generateInvoiceNumber from '../../utils/generateAutoIncremental';
import { RoadMapTemplate } from '../templates/RoadMapTemplate';
import { generatePDF } from '../../utils/generatePdf';
import { uploadPdfToStorage } from '../../utils/uploadPdfToStorage';
import toast from 'react-hot-toast';
import { db } from '../../services/FirebaseService';

interface EditInvoiceProps {
  formData: RoadMapProps;
}

const EditInvoice: React.FC<EditInvoiceProps> = ({formData}) => {
  
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState<boolean>(false)
  const [localFormData, setLocalFormData] = useState<RoadMapProps>(formData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLocalFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof User
  ) => {
    const { value } = e.target;
    setLocalFormData({
      ...localFormData,
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

      console.log('formData', localFormData)

      db.collection('road-maps').doc(localFormData.id).update(localFormData)

     /*  
      const roadMapInstance = new RoadMap();
      const { invoiceNumber } = await generateInvoiceNumber();
      const roadMapTemplate = RoadMapTemplate({...formData, invoiceNumber}, userProfile);
      const pdf = await generatePDF(roadMapTemplate)
      const url: any = await uploadPdfToStorage(pdf, formData.id)

      await roadMapInstance.create({
        ...formData, 
        invoiceNumber, 
        id: formData.id, 
        invoiceUrl: url
      }); */

      /* setFormData({
        id: '', 
        client: {
          name: '',
          lastName: '',
          documentType: '',
          documentID: '',
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
        invoiceNumber: "",
        invoiceUrl: '',
      });
 */
      setLoading(false);
      toast.success('Factura actualizada correctamente')

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
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Número de factura:
            </label>
            <input
              type="text"
              name="invoiceNumber"
              value={localFormData.invoiceNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
        </div>
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
              value={localFormData.client.name}
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
              value={localFormData.client.lastName}
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
              value={localFormData.client.documentType}
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
              value={localFormData.client.documentID}
              onChange={(e) => handleClientChange(e, 'documentID')}
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
              value={localFormData.client.phone}
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
              value={localFormData.client.email}
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
            value={localFormData.origin}
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
              value={localFormData.destination}
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
              value={localFormData.contractedService}
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
              value={localFormData.serviceType}
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
              value={localFormData.passengers}
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
              value={localFormData.paymentMethod}
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
              value={localFormData.price}
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
            Actualizar hoja de ruta
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

export default EditInvoice;