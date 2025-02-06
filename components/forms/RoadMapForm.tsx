import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
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
import { FaRegFilePdf } from "react-icons/fa";
import toast from 'react-hot-toast';

const RoadMapForm = () => {

  const { currentUser, userProfile } = useAuth();
  const { roadmaps, lastInvoiceNumber } = useRoadmaps();
  const userRoadmaps = roadmaps.filter(roadMap => currentUser?.uid === roadMap.driverId);
  const [loading, setLoading] = useState<boolean>(false)
  const [onProgress, setOnProgress] = useState<number>(0)  
  const [formData, setFormData] = useState<RoadMapProps>({
    id: "",
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
    serviceType: 'Discresional',
    contractedService: '',
    passengers: 4,
    price: 0,
    paymentMethod: "",
    driverId: currentUser?.uid,
    vehicle: '',
    invoiceNumber: "",
    invoiceUrl: "",
    observations: ""
  });

  useEffect(() => {
    setFormData(prevState => ({ ...prevState, id: uuidv4() }));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'passengers' || name === 'price' ? Number(value) : value,
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

  const uploadPdfAndGetUrl = async (pdf: File, id: string): Promise<string> => {
    const uploadUrl = await uploadPdfToStorage(pdf, id, setOnProgress);
  
    if (!uploadUrl) {
      toast.error('Ha fallado la carda del documente PDF, intentelo nuevamente');
      throw new Error(`Failed to upload PDF with id ${id}`);
    }
  
    return uploadUrl;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);
  
    try {

      if(!userProfile){
        return toast.error("No hay perfil")
      }
      
      const roadMapInstance = new RoadMap();

      const invoiceNumber = lastInvoiceNumber 
      ? `INV-${String(parseInt(lastInvoiceNumber.split('-')[1]) + 1).padStart(5, '0')}`
      : 'INV-00001';

      const roadMapTemplate = RoadMapTemplate({...formData, invoiceNumber}, userProfile);
      const pdfResult = await generatePDF(roadMapTemplate);

      if (!pdfResult) {
        throw new Error('Failed to generate PDF');
      };

      const { file: pdf, url } = pdfResult;

      if(!formData.id) throw new Error('Failed to generate PDF');

      const uploadUrl = await uploadPdfAndGetUrl(pdf, formData.id)

      if (!uploadUrl) {
        toast.error('Ha fallado la carda del documente PDF, intentelo nuevamente')
        throw new Error('Failed to upload PDF');
      };

      await roadMapInstance.create({
        ...formData, 
        invoiceNumber: invoiceNumber, 
        id: formData.id, 
        invoiceUrl: uploadUrl
      });
      
      toast.success('Hoja de ruta creada correctamente');
      setFormData({
        id: uuidv4(), 
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
        serviceType: 'Discresional',
        contractedService: '',
        passengers: 4,
        paymentMethod: '',
        price:0,
        driverId: currentUser?.uid,
        vehicle: '',
        invoiceNumber: "",
        invoiceUrl: "",
        observations: ""
      });

      setLoading(false);

    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error('ups, algo ha ido mal. Intentelo nuevamente');
    };
  };

  return (
    <div>
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
                type="text"
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
                type="text"
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
                  <option value="1999FSK">1999FSK</option>
                  <option value="0774HKP">0774HKP</option>
                </datalist>
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
              className=" text-black text-center font-bold py-2 px-4 rounded-md flex flex-col justify-center align-middle w-full"
            >
              <div className='flex gap-4 w-full justify-center'>
                <GreatLoader />
                <p>{onProgress}%</p>
              </div>
              <div className='w-full text-center'>Guardando hoja de ruta. Un momento por favor.  <br />
              No cierre la ventana hasta que se haya completado la carga. </div>
              
            </div>
          }
        </div>
      </form>

      <div className='mx-auto max-w-4xl p-6 bg-white rounded-md shadow-lg flex flex-col gap-3'>
          <h1 className='text-gray-700 text-lg font-bold'>Mis hojas de ruta</h1>
          <div className='flex gap-4 flex-wrap w-full justify-center'>
            {userRoadmaps.map((roadmap, key) => {


            const timestamp = roadmap.date instanceof Date
            ? roadmap.date
            : new Date(roadmap.date.seconds * 1000 + (roadmap.date.nanoseconds || 0) / 1e6);

            const date = timestamp.toLocaleDateString();
            const time = timestamp.toLocaleTimeString();

              return(
                <div key={key} className=' w-30 h-fit '
                  style={{
                    border: '1px solid #e0e0e0',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <p><strong>Clinte:</strong> {roadmap.client.name}</p>
                  <p>{date} / {time}</p>
                  <a href={roadmap.invoiceUrl} target="_blank" rel="noreferrer">
                    <FaRegFilePdf color='#ff0000' fontSize={40} />
                  </a>
                </div>
              )
            })}
          </div>
      </div>
    </div>
  );
};

export default RoadMapForm;