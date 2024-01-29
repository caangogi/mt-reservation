import  { useEffect, useState } from 'react'
import Image from 'next/image'
import { UsersIcon } from '@heroicons/react/solid'
import {FaLuggageCart} from 'react-icons/fa'
import {GiCycling, GiSchoolBag, GiTwoCoins} from 'react-icons/gi'
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';
import {DateRange} from 'react-date-range';
import { useRouter } from 'next/dist/client/router';
import {DataTransfer} from '../data/TarifasTransporte';
import {motion} from 'framer-motion';
import {formatterEuro} from '../../utils/formatEur'
import {db} from '../../services/FirebaseService';
import toast from 'react-hot-toast';
import Payments from '../payments'
import { FaCcStripe, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { RiSecurePaymentLine } from 'react-icons/ri';

export default function BookingForm({setToBooking, toBooking, placeholder}) {

  const [bookingState, setBookingState] = useState({
    startDate: new Date(),
    endDate: new Date(),
    numOfGuests: 5,
    numOfBags: 0,
    numOfMiniBags: 0,
    numOfBikes: 0,
    babyChair: false,
    price: 0,

    payment: {
      paymentID: '',
      fullPayment: true,
      confirmed: false,
    },

    name: '',
    email: '',
    phone: '',
    documentType: '',
    document: '',
    comments: '',
    termsAndConditions: false 
  });

  const [searchInput, setSearchInput] = useState("");
  const [formStep, setFormStep] = useState(1);
  const [fromOurTo, setFromOurTo] = useState(true);
  const [bookingID, setBookingID] = useState(null);

  const handleSelect = (ranges) =>{
      setBookingState({
        ...bookingState,
        startDate: ranges.selection.startDate,
        endDate: ranges.selection.endDate,
      })
  };

  const bookingStateChange = (e) =>{
    const value = e.target.type ===  'checkbox' ?  e.target.checked : e.target.value;
     setBookingState({
      ...bookingState,
        [e.target.name]  : [value]
     })
  }

  const handleSearchInput = (event) => {
    event.preventDefault();
    const input = event.target.value;
    setSearchInput(input);
  };

  function calcularPrecio(ubicacion, cantidadPasajeros) {
    const ubicacionData = DataTransfer.find(item => item.name === ubicacion);
  
    let rangoPasajeros;
    
    if (cantidadPasajeros >= 1 && cantidadPasajeros <= 4) {
      rangoPasajeros = 0;
    } else if (cantidadPasajeros >= 5 && cantidadPasajeros <= 8) {
      rangoPasajeros = 1;
    } else if (cantidadPasajeros >= 9 && cantidadPasajeros <= 12) {
      rangoPasajeros = 2;
    } else if (cantidadPasajeros >= 13 && cantidadPasajeros <= 15) {
      rangoPasajeros = 3;
    } else if (cantidadPasajeros >= 16 && cantidadPasajeros <=20){
      return ubicacionData.values[3] + 45
    } else if(cantidadPasajeros >=21 && cantidadPasajeros <=25){
      return ubicacionData.values[3] + 50
    }else{
      return 'Por favor contactar vía whatsapp'
    }
    
      return ubicacionData.values[rangoPasajeros];
  };

  function totalPrice(){
    const price = calcularPrecio(searchInput, bookingState.numOfGuests)
    const isSameDay = bookingState.startDate === bookingState.endDate;
    const total = isSameDay  ? price : (price * 0.9) * 2;
    setBookingState({
      ...bookingState, 
      price: total,
    })
  }
 
  const selectionRange = {
    startDate: bookingState.startDate,
    endDate: bookingState.endDate,
    key:'selection'
  };

  const createBooking = async (bookingState) => {
    try {
      const result = await db.collection("bookings").add(bookingState);
      if(result){
        setBookingID(result.id)
        toast.success('Reserva creada')
      }
    } catch (error) {
      toast.error('Ups, algo ha ido mal creando la reserva. Intentelo de nuevo.')
      console.log(error)
      throw new Error('Error al crear el pago');
    }
  }

  const nextStep = () =>{
    totalPrice()
    return setFormStep(() => formStep + 1)
  };

  const prevStep = () =>{
    return setFormStep(() => formStep - 1)
  };

  useEffect(() => {
    if(!toBooking) return
    setSearchInput('PALMA CITY')
  }, [toBooking])


  useEffect(() => {handleSelect(selectionRange)}, [searchInput])


  return (
    <div>
      
      <div className='flex items-center justify-around'>

          <div 
            className='flex flex-col lg:flex-row items-left border-2 rounded-full px-5 py-2 lg:px-5 shadow-sm w-screen lg:w-fit'
          >

            {fromOurTo ? (
              <div 
                onClick={() => setFromOurTo(false)}
                className='flex justify-center bg-blue-app rounded-full shadow-md  py-1 px-4 lg:p-3'
              >
                <span  className='text-sm lg:text-lg cursor-pointer text-white'>
                  DESDE EL AEROPUERTO HACIA
                </span>
              </div> 
            ) : (
              <div
                onClick={() => setFromOurTo(true)}
                className='flex justify-center bg-blue-app rounded-full shadow-md py-1 px-4 lg:p-3'
              > 
                <span className='text-sm lg:text-lg cursor-pointer text-white'>
                  HACIA EL AEROPUERTO DESDE
                </span>
              </div>
            )}
              
            <div className='flex'>
              <select 
                  value={searchInput} 
                  onChange={handleSearchInput} 
                  defaultValue='Buscar destino'
                  className='pl-5 pr-5 lg:pl-5 lg:pr-5 bg-transparent outline-none flex-grow text-xsm lg:text-lg text-gray-600 placeholder-gray-400 cursor-pointer text-center lg:text-left'
                >
                  <option value="" className='text-sm lg:text-lg cursor-pointer'>
                    {
                      placeholder ? placeholder : fromOurTo ? 'BUSCAR DESTINO' : 'BUSCAR ORIGEN'
                    }
                  </option>
                  {DataTransfer?.map((item, i) => {
                    return(
                      <option key={i} value={item.name} className='text-sm lg:text-lg cursor-pointer'>{item.name}</option>
                    )
                  })}
              </select>
            </div>
            
          </div>

      </div>

      {searchInput || toBooking ? (
        <div className='searchApp flex justify-center h-[88vh] backdrop-blur-md overflow-scroll fixed top-[17vh] md:top-[13vh] left-0 w-full'>
          <motion.div 
            className='flex flex-col gap-1 justify-between col-span-3 w-96 mt-2 border-2 p-4 rounded-2xl shadow-md bg-white h-[80%] md:h-[90%]'
            initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.3,
                duration: .21,
            }}
          >

            {formStep === 1 && (
              <>
                <DateRange 
                  ranges={[selectionRange]}
                  minDate={new Date()}
                  rangeColors={['#00c3ff']}
                  onChange={handleSelect}
                />
              
                <div className='flex items-center border-b mb-4 pl-2'>
                  {bookingState.startDate === bookingState.endDate && (<h2 className='text-sm lg:text-lg flex-grow'>Servicio solo ida. <br/> Seleccionando ida y regreso puedes ahorrar hasta un 10%</h2>)}
                  {bookingState.startDate < bookingState.endDate && (
                    <>
                        <h2 className='text-sm lg:text-lg flex-grow text-green-wapp'>Servicio de ida y regreso. Estas ahorrando un 10%</h2>
                        <GiTwoCoins className='text-sm lg:text-2xl flex-grow text-green-wapp'/>
                    </>
                  )}
                </div>
              </>
            )} 
            
            {formStep === 2 && ( 
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.3,
                  duration: .21,
                }}
              >
                <div className='flex items-center border rounded-lg mb-4'>
                  <h2 className='text-sm lg:text-lg flex-grow pl-2'>Número de pasajeros</h2>
                  <UsersIcon className='h-5' />
                  <input 
                    type="number" 
                    inputMode="numeric"
                    className=' w-20 border rounded-lg  pl-2 p-1 text-lg outline-none text-blue-app'
                    name='numOfGuests'
                    value={bookingState.numOfGuests}
                    onChange={bookingStateChange}
                    min={0}
                  />
                </div>
                <div className='flex items-center border rounded-lg mb-4'>
                  <h2 className='text-sm lg:text-lg flex-grow pl-2'>Número de maletas</h2>
                  <FaLuggageCart className='h-10 text-lg' />
                  <input 
                    type="number" 
                    inputMode="numeric"
                    className=' w-20 border rounded-lg  pl-2 p-1 text-lg outline-none text-blue-app'
                    name='numOfBags'
                    value={bookingState.numOfBags}
                    onChange={bookingStateChange}
                    min={1}
                  />
                </div>
                <div className='flex items-center border rounded-lg mb-4'>
                  <h2 className='text-sm lg:text-lg flex-grow pl-2'>Número de muchilas</h2>
                  <GiSchoolBag className='h-10 text-lg' />
                  <input 
                    type="number" 
                    inputMode="numeric"
                    className=' w-20 border rounded-lg  pl-2 p-1 text-lg outline-none text-blue-app'
                    name='numOfMiniBags'
                    value={bookingState.numOfMiniBags}
                    onChange={bookingStateChange}
                    min={1}
                  />
                </div>
                <div className='flex items-center border rounded-lg mb-4'>
                  <h2 className='text-sm lg:text-lg flex-grow pl-2'>Número de bicicletas</h2>
                  <GiCycling className='h-10 text-lg' />
                  <input 
                    type="number" 
                    inputMode="numeric"
                    className=' w-20 border rounded-lg  pl-2 p-1 text-lg outline-none text-blue-app'
                    name='numOfBikes'
                    value={bookingState.numOfBikes}
                    onChange={bookingStateChange}
                    min={0}
                  />
                </div>
                <div className='flex items-center border-b mb-4 pr-5'>
                  <h2 className='text-sm lg:text-lg flex-grow pl-2'>Silla de bebe</h2>
                  <input 
                    type="checkbox" 
                    className='w-6 h-6 bg-blue-app '
                    name='babyChair'
                    value={bookingState.babyChair}
                    onChange={bookingStateChange}
                    min={0}
                  />
                </div>
              </motion.div>
            )}

            {formStep === 3 && ( 
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.3,
                  duration: .21,
                }}
              >
                
                <div className='flex flex-col '>
                  <h2 className='text-sm lg:text-lg flex-grow pl-2'>Nombre</h2>
                  <input 
                    type="text" 
                    className='border rounded-lg mb-3 pl-2 p-1 text-lg outline-none text-blue-app'
                    name='name'
                    value={bookingState.name}
                    onChange={bookingStateChange}
                  />
                </div>

                <div className='flex flex-col items-left '>
                  <h2 className='text-sm lg:text-lg flex-grow pl-2'>Email</h2>
                  <input 
                    type="email"
                    className='border rounded-lg mb-3 pl-2 p-1 text-lg outline-none text-blue-app'
                    name='email'
                    value={bookingState.email}
                    onChange={bookingStateChange}
                  />
                </div>

                <div className='flex flex-col '>
                  <h2 className='text-sm lg:text-lg flex-grow  mt-1'>Número de teléfono</h2>
                  <input 
                    type="text" 
                    className='border rounded-lg mb-3 pl-2 p-1 text-lg outline-none text-blue-app'
                    name='phone'
                    value={bookingState.phone}
                    onChange={bookingStateChange}
                  />
                </div>

                <div className='flex flex-col '>
                  <h2 className='text-sm lg:text-lg flex-grow  mt-1'>Observación y/o commentarios</h2>
                  <textarea 
                    type="text" 
                    className='border rounded-lg mb-3 pl-2 p-1 text-lg outline-none text-blue-app'
                    name='comments'
                    value={bookingState.comments}
                    onChange={bookingStateChange}
                  />
                </div>

                <div className='flex items-center border-b  pr-5'>
                  <h2 className='text-sm lg:text-lg flex-grow pl-2'>Aceptar terminos y condiciones</h2>
                  <input 
                    type="checkbox" 
                    className='w-6 h-6 bg-blue-app '
                    name='babyChair'
                    value={bookingState.babyChair}
                    onChange={bookingStateChange}
                    min={0}
                  />
                </div>
                
              </motion.div>
            )}

            {formStep === 4 && ( 
              <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.21,
                  }}
                >
                 
                  <div className='flex items-center border-b mb-4 pl-2'>
                    {bookingState.startDate === bookingState.endDate && (<h2 className='text-sm lg:text-lg flex-grow'>Solo ida. Seleccionando ida y regreso puedes ahorrar hasta un 10%</h2>)}
                    {bookingState.startDate < bookingState.endDate && (
                      <>
                          <h2 className='text-sm lg:text-lg flex-grow text-green-wapp'>Servicio de ida y regreso. <br/> Estas ahorrando un 10%</h2>
                          <GiTwoCoins className='text-sm lg:text-2xl flex-grow text-green-wapp'/>
                      </>
                    )}
                  </div>
                  <div className="flex px-3 items-center border rounded-lg mb-4">
                    <FaLuggageCart className="h-10 text-lg" />
                    <h2 className="text-sm lg:text-lg flex-grow pl-2">Fecha</h2>
                    <span className="text-lg">{bookingState.startDate.toDateString()}</span>
                  </div>
                  {bookingState.startDate < bookingState.endDate && (
                      <div className="flex px-3 items-center border rounded-lg mb-4">
                        <FaLuggageCart className="h-10 text-lg" />
                        <h2 className="text-sm lg:text-lg flex-grow pl-2">Fecha</h2>
                        <span className="text-lg">{bookingState.endDate.toDateString()}</span>
                      </div>
                  )}
                  <div className="flex px-3 items-center border rounded-lg mb-4">
                    <UsersIcon className='h-5' />
                    <h2 className="text-sm lg:text-lg flex-grow pl-2">Número de pasajeros</h2>
                    <span className="text-lg">{bookingState.numOfGuests}</span>
                  </div>

                  <div 
                    className={`flex px-3 items-center border rounded-lg mb-4 ${bookingState.payment.fullPayment && 'bg-green-400 text-white'}`}
                    onClick={() => {
                      setBookingState({
                        ...bookingState, 
                         payment: {
                          ...bookingState.payment,
                          fullPayment: true
                        }
                      })
                    }}
                  >
                    <h2 className="text-xl lg:text-lg flex-grow pl-2">Total del servicio</h2>
                    <span className="text-xl">{formatterEuro.format(bookingState.price)}</span>
                  </div>
            
                  <div 
                    className={`flex px-3 items-center border rounded-lg mb-4 ${!bookingState.payment.fullPayment && 'bg-green-400 text-slate-800'}`}
                    onClick={() => {
                      setBookingState({
                        ...bookingState, 
                        payment: {
                          ...bookingState.payment,
                          fullPayment: false
                        }
                      })
                    }}
                  >
                    <h2 className="text-xl lg:text-lg flex-grow pl-2">Reserva ahora por </h2>
                    <span className="text-xl">{formatterEuro.format(bookingState.price *.1)}</span>
                  </div>

                  <div className='flex text-lg gap-2 items-center text-slate-700 mt-4'>
                    <RiSecurePaymentLine className="text-2xl"/>
                    <span>Pagos seguros </span>
                    <FaCcStripe className="text-2xl text-purple-700"/>
                    <FaCcVisa className="text-2xl "/>
                    <FaCcMastercard className="text-2xl "/>
                  </div>
                </motion.div>
            )}

            {formStep === 5 && bookingID !== null && (
              <Payments 
                amount={(bookingState.payment.fullPayment ? bookingState.price : bookingState.price *.1)}
                params={{
                  location: searchInput,
                    startDate: bookingState.startDate.toISOString(),
                    endDate: bookingState.endDate.toISOString(),
                    noOfGuests : bookingState.numOfGuests,
                    noOfBags: bookingState.numOfBags,
                    numOfBikes : bookingState.numOfBikes,
                    babyChair: bookingState.babyChair,
                    fromOurTo: fromOurTo,
                    price: bookingState.price,
                    bookingID: bookingID
                }}
              />
            )}

            <div className='flex'>
              <button 
                className='flex-grow'
                onClick={() =>{
                  if(formStep === 1){
                    setToBooking(false)
                    return setSearchInput("")
                  }
                  return prevStep();
                }}
              >
                <span className='text-sm lg:text-lg cursor-pointer'>
                  Cancelar
                </span>
              </button>

              {formStep !== 5 && (
               formStep === 4 ? 
                <button 
                  className='flex-grow text-green-500 border-2 border-green-500 rounded-full '
                  onClick={async () => {
                    await createBooking(bookingState);
                    return nextStep()
                  }}
                >
                  <span className='text-sm lg:text-lg cursor-pointer'>
                  {'Pagar' }
                  </span>
                </button>
              : 
                <button 
                  className='flex-grow text-blue-app border-2 border-blue-app rounded-full '
                  onClick={() => {
                    if(formStep === 4){
                      return search()
                    }
                    return nextStep()
                  }}
                >
                  <span className='text-sm lg:text-lg cursor-pointer'>
                  {formStep === 3 ?  ("Resumen") : ("Continuar") }
                  </span>
                </button> 
            
              )}
            </div>

          </motion.div>
        </div>
      ): <></>}
 
    </div>
  )
}
