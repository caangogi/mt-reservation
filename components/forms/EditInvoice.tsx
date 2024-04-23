import React, {useState} from 'react'
import { RoadMapProps } from "../../backend/road-map/domain/types"; 
import { User } from '../../backend/share/types';
import { municipios } from '../data/MarllorcaMunicipios';
import GreatLoader from '../loaders/GreatLoader';
import toast from 'react-hot-toast';
import { db } from '../../services/FirebaseService';
import { RoadMapTemplate } from '../templates/RoadMapTemplate';

interface EditInvoiceProps {
  formData: RoadMapProps;
}

const EditInvoice: React.FC<EditInvoiceProps> = ({formData}) => {
  
  const [loading, setLoading] = useState<boolean>(false)
  const [localFormData, setLocalFormData] = useState<RoadMapProps>(formData);

  const timestamp = localFormData.date instanceof Date
  ? localFormData.date
  : new Date(localFormData.date.seconds * 1000 + (localFormData.date.nanoseconds || 0) / 1e6);


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLocalFormData({
      ...localFormData,
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
        ...localFormData.client,
        [field]: value,
      },
    });
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const date = localFormData.date instanceof Date
      ? localFormData.date
      : new Date(localFormData.date.seconds * 1000 + (localFormData.date.nanoseconds || 0) / 1e6);
  
    let dateStr = date.toISOString().split('T')[0];
    let timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  
    if (name === 'date') {
      const dateParts = value.split('-');
      if (dateParts.length !== 3 || isNaN(+dateParts[0]) || isNaN(+dateParts[1]) || isNaN(+dateParts[2])) {
        console.error('Invalid date value:', value);
        return;
      }
  
      dateStr = value;
    } else if (name === 'time') {
      // Valida el valor de la hora
      const timeParts = value.split(':');
      if (timeParts.length !== 2 || isNaN(+timeParts[0]) || isNaN(+timeParts[1])) {
        console.error('Invalid time value:', value);
        return;
      }
  
      timeStr = value;
    }
  
    // Combina la fecha y la hora en un solo objeto Date
    const newDate = new Date(`${dateStr}T${timeStr}:00`);
  
    setLocalFormData({
      ...localFormData,
      date: newDate
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {

      // TODO actualizar el PDF con los datos del conductor. 
      // const roadMapTemplate = new RoadMapTemplate(localFormData);

      await db.collection('road-maps').doc(localFormData.id).update(localFormData)
      setLoading(false);
      toast.success('Hoja de ruta actualizada correctamente')
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
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Fecha: {timestamp.toLocaleDateString()}
            </label>
            <input
              type="date"
              name="date"
              value={timestamp.toLocaleDateString()}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border rounded-md"
            />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Hora:
            </label>
            <input
              type="time"
              name="time"
              value={timestamp.toLocaleTimeString().slice(0, 5)} 
              onChange={handleDateChange}
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
          <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Vehículo:
              </label>
              <input
                name="vehicle"
                type='text'
                list='vehicles'
                value={localFormData.vehicle}
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
                value={localFormData.observations}
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