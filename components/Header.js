import React, { useState } from 'react'
import styles from '../styles/Header.module.scss';
import Image from 'next/image'
import { SearchIcon, GlobeAltIcon, MenuIcon, UserCircleIcon, UsersIcon } from '@heroicons/react/solid'
import {FaLuggageCart} from 'react-icons/fa'
import {GiCycling, GiAirplaneArrival, GiAirplaneDeparture, GiSchoolBag, GiTwoCoins} from 'react-icons/gi'
import {BiSolidOffer} from 'react-icons/bi'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {DateRange} from 'react-date-range';
import { useRouter } from 'next/dist/client/router';
import {mallorcaMunicipios} from '../components/data/MarllorcaMunicipios';
import {DataTransfer} from '../components/data/TarifasTransporte';
import Logo from '../public/images/logo_02.png';
import {motion} from 'framer-motion';

import {db} from '../services/FirebaseService';
import toast from 'react-hot-toast';

function Header({placeholder}) {

  const [bookingState, setBookingState] = useState({
    startDate: new Date(),
    endDate: new Date(),
    numOfGuests: 5,
    numOfBags: 0,
    numOfMiniBags: 0,
    numOfBikes: 0,
    babyChair: false,
    price: 0,

    name: '',
    email: '',
    documentType: '',
    document: '',
    termsAndConditions: false 
  });

  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [formStep, setFormStep] = useState(1)
  const [fromOurTo, setFromOurTo] = useState(true)

  const router = useRouter();

  const handleSelect = (ranges) =>{
      setBookingState({
        ...bookingState,
        startDate: ranges.selection.startDate,
        endDate: ranges.selection.endDate
      
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
    const input = event.target.value;
    setSearchInput(input);
  
    if (input) {
      const filteredSuggestions = mallorcaMunicipios.municipios.filter((municipio) =>
        municipio.toLowerCase().startsWith(input.toLowerCase())
      );
    } else {
      setSuggestions([]);
    }
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
 
  const selectionRange = {
    startDate: bookingState.startDate,
    endDate: bookingState.endDate,
    key:'selection'
  };

  const search = async () =>{

    await createBooking({...bookingState, price:  calcularPrecio(searchInput, bookingState.numOfGuests)  });

    router.push({
      pathname: '/search',
      query: {
        location: searchInput,
        startDate: bookingState.startDate.toISOString(),
        endDate: bookingState.endDate.toISOString(),
        noOfGuests : bookingState.numOfGuests,
        noOfBags: bookingState.numOfBags,
        numOfBikes : bookingState.numOfBikes,
        babyChair: bookingState.babyChair,
        fromOurTo: fromOurTo,
        price: calcularPrecio(searchInput, bookingState.numOfGuests)
      }
    })
  };


  const createBooking = async (bookingState) => {
    try {
      const result = await db.collection("bookings").add(bookingState);
      toast.success('Reserva creada')
      console.log(result)
    } catch (error) {
      toast.error('Ups, algo ha ido mal creando la reserva. Intentelo de nuevo.')
      console.log(error)
    }
  }

  const nextStep = () =>{
    return setFormStep(() => formStep + 1)
  };

  const prevStep = () =>{
    return setFormStep(() => formStep - 1)
  };

  return (
    <header 
      className='sticky top-0 z-50 py-1 md:px-10 flex-col'
    >
      <div className='flex flex-col gap-4 justify-around items-center lg:flex-row bg-white p-6 rounded-2xl lg:rounded-full shadow-md'>
        
        <div 
          className='relative flex items-center gap-3 h-10 cursor-pointer my-auto'
          onClick={() => router.push('/')}
        >
          <Image 
              src={Logo}
              width={50}
              height={50}
              alt='Mallorca Transfer Logo'
          />
          <div className='flex flex-col'>
            <p className='text-xl text-blue-app'>Mallorca Transfer</p>
            <span className='text-xs text-blue-app'>Big One For Groups</span>
          </div>
        </div>
      
        <div className='flex items-center justify-around'>

          <div 
            className='flex flex-col lg:flex-row items-left border-2 rounded-full px-5 py-2 lg:px-5 shadow-sm w-screen lg:w-fit'
          >

            {fromOurTo ? (
              <div 
                onClick={() => setFromOurTo(false)}
                className='flex items-center gap-4'
              >
                <GiAirplaneArrival 
                  style={{
                    fontSize: '2rem',
                    color: '#00CCFF'
                  }}
                />
                <span  className='text-sm lg:text-lg cursor-pointer'>
                  Desde el aeropuerto a
                </span>
              </div> 
            ) : (
              <div
                onClick={() => setFromOurTo(true)}
                className='flex items-center gap-4'
              > 
                <GiAirplaneDeparture
                  style={{
                    fontSize: '2rem',
                    color: '#00CCFF'
                  }}
                />
                <span className='text-sm lg:text-lg cursor-pointer'>
                  Hacia el aeropuerto desde
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
                      placeholder ? placeholder : fromOurTo ? 'Buscar destino' : 'Buscar origen'
                    }
                  </option>
                  {DataTransfer?.map((item, i) => {
                    return(
                      <option key={i} value={item.name} className='text-sm lg:text-lg cursor-pointer'>{item.name}</option>
                    )
                  })}
              </select>
              <SearchIcon className='hidden md:inline-flex h-8 bg-blue-app text-white rounded-full p-2 cursor-pointer mx-2 '/>
            </div>
            
          </div>

        </div>

      </div>

      {searchInput && (
        <div className='flex justify-center'>

         {/*  <motion.div 
            className={styles.steps_container}
            initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                delay: 0.3,
                duration: .5,
            }}
          >
            <div className={styles.steps_content}>

                <h1>Hola !!</h1>

            </div>
          </motion.div> */}




          <motion.div 
            className='flex flex-col col-span-3 w-max lg:w-96 mt-2 border-2 p-4 rounded-2xl shadow-md bg-white'
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
                <div className='flex items-center border-b mb-4'>
                  <h2 className='text-sm lg:text-lg flex-grow pl-2'>Número de pasajeros</h2>
                  <UsersIcon className='h-5' />
                  <input 
                    type="number" 
                    inputMode="numeric"
                    className='w-12 pl-2 text-2xl outline-none text-blue-app'
                    name='numOfGuests'
                    value={bookingState.numOfGuests}
                    onChange={bookingStateChange}
                    min={0}
                  />
                
                </div>
                <div className='flex items-center border-b mb-4 pl-2'>
                  {bookingState.startDate === bookingState.endDate && (<h2 className='text-sm lg:text-lg flex-grow'>Solo ida</h2>)}
                  {bookingState.startDate < bookingState.endDate && (
                    <>
                        <h2 className='text-sm lg:text-lg flex-grow text-green-wapp'>Ida y regreso, ahorra hasta un 15%</h2>
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
                
                <div className='flex items-center border-b mb-4'>
                  <h2 className='text-sm lg:text-lg flex-grow pl-2'>Número de maletas</h2>
                  <FaLuggageCart className='h-10 text-lg' />
                  <input 
                    type="number" 
                    inputMode="numeric"
                    className='w-12 pl-2 text-2xl outline-none text-blue-app'
                    name='numOfBags'
                    value={bookingState.numOfBags}
                    onChange={bookingStateChange}
                    min={1}
                  />
                </div>
                <div className='flex items-center border-b mb-4'>
                  <h2 className='text-sm lg:text-lg flex-grow pl-2'>Número de muchilas</h2>
                  <GiSchoolBag className='h-10 text-lg' />
                  <input 
                    type="number" 
                    inputMode="numeric"
                    className='w-12 pl-2 text-2xl outline-none text-blue-app'
                    name='numOfMiniBags'
                    value={bookingState.numOfMiniBags}
                    onChange={bookingStateChange}
                    min={1}
                  />
                </div>
                <div className='flex items-center border-b mb-4'>
                  <h2 className='text-sm lg:text-lg flex-grow pl-2'>Número de bicicletas</h2>
                  <GiCycling className='h-10 text-lg' />
                  <input 
                    type="number" 
                    inputMode="numeric"
                    className='w-12 pl-2 text-2xl outline-none text-blue-app'
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
                
                <div className='flex flex-col mb-4'>
                  <h2 className='text-sm lg:text-lg flex-grow pl-2'>Nombre</h2>
                  <input 
                    type="text" 
                    className='pl-2 py-1 text-sm lg:text-lg text-blue-app border-2 rounded-2xl mt-1'
                    name='name'
                    value={bookingState.name}
                    onChange={bookingStateChange}
                  />
                </div>

                <div className='flex flex-col items-left mb-4'>
                  <h2 className='text-sm lg:text-lg flex-grow pl-2'>Tipo de documento</h2>
                  <input 
                    type="text"
                    list='documentTypes'
                    className='border-2 rounded-2xl pl-2 py-1 text-sm lg:text-lg outline-none text-blue-app'
                    name='documentType'
                    value={bookingState.documentType}
                    onChange={bookingStateChange}
                  />
                  <datalist id='documentTypes'>
                    <option value="DNI"></option>
                    <option value="NIE"></option>
                    <option value="PASAPORTE"></option>
                  </datalist>
                </div>

                <div className='flex flex-col mb-4'>
                  <h2 className='text-sm lg:text-lg flex-grow  mt-1'>Número de documento</h2>
                  <input 
                    type="text" 
                    className='text-sm lg:text-lg text-blue-app pl-2 py-1 border-2 rounded-2xl'
                    name='document'
                    value={bookingState.document}
                    onChange={bookingStateChange}
                  />
                </div>
                <div className='flex items-center border-b mb-4 pr-5'>
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


            <div className='flex '>
              <button 
                className='flex-grow'
                onClick={() =>{
                  if(formStep === 2 || formStep === 3){
                    return prevStep();
                  }
                  return setSearchInput("")
                }}
              >
                <span className='text-sm lg:text-lg cursor-pointer'>
                  Cancelar
                </span>
              </button>
              <button 
                className='flex-grow text-blue-app border-2 border-blue-app rounded-full '
                onClick={() => {
                  if(formStep === 3){
                    return search()
                  }
                  return nextStep()
                }}
              >
                <span className='text-sm lg:text-lg cursor-pointer'>
                {formStep === 2 ?  ("Continuar") : ("Reservar") }
                </span>
              </button>
            </div>

          </motion.div>


        </div>
      )}

    </header>
  ) 
}

export default Header
