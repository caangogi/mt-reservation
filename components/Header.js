import React, { useState } from 'react'
import Image from 'next/image'
import { SearchIcon, GlobeAltIcon, MenuIcon, UserCircleIcon, UsersIcon } from '@heroicons/react/solid'
import {FaLuggageCart} from 'react-icons/fa'
import {GiCycling, GiAirplaneArrival, GiAirplaneDeparture} from 'react-icons/gi'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {DateRange} from 'react-date-range';
import { useRouter } from 'next/dist/client/router';
import {mallorcaMunicipios} from '../components/data/MarllorcaMunicipios';
import {DataTransfer} from '../components/data/TarifasTransporte';
import Logo from '../public/images/logo_02.png';
import {motion} from 'framer-motion';

function Header({placeholder}) {

  const [bookingState, setBookingState] = useState({
    startDate: new Date(),
    endDate: new Date(),
    numOfGuests: 5,
    numOfBags: 0,
    numOfBikes: 0,
    babyChair: false
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

  const search = () =>{
    router.push({
      pathname: '/search',
      query: {
        location: searchInput,
        startDate: bookingState.startDate.toISOString(),
        endDate: bookingState.endDate.toISOString(),
        noOfGuests : bookingState.numOfGuests,
        noOfBags: bookingState.numOfBags,
        numOfBikes : bookingState.numOfBikes,
        price: calcularPrecio(searchInput, bookingState.numOfGuests)
      }
    })
  };

  const nextStep = () =>{
    return setFormStep(() => formStep + 1)
  };

  const prevStep = () =>{
    return setFormStep(() => formStep - 1)
  };
/* 
  console.log(bookingState) */


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

          <div className='flex flex-col lg:flex-row items-left border-2 rounded-full py-2 pl-3 shadow-sm w-screen lg:w-fit'>
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
              
             <div className='flex '>
              <select 
                  value={searchInput} 
                  onChange={handleSearchInput} 
                  defaultValue='Buscar destino'
                  className='pl-1 pr-1 lg:pl-5 lg:pr-5 bg-transparent outline-none flex-grow text-xsm lg:text-lg text-gray-600 placeholder-gray-400 cursor-pointer'
                >
                  <option value="">
                    {
                      placeholder ? placeholder : fromOurTo ? 'Buscar destino' : 'Buscar origen'
                    }
                  </option>
                  {DataTransfer?.map((item, i) => {
                    return(
                      <option key={i} value={item.name}>{item.name}</option>
                    )
                  })}
                </select>
                <SearchIcon className='md:inline-flex h-8 bg-blue-app text-white rounded-full p-2 cursor-pointer mx-2'/>
             </div>
          </div>

        </div>

      </div>

      {searchInput && (
        <div className='bg-white w-max lg:w-96 flex flex-col col-span-3 mx-auto mt-2 border-2  p-4 rounded-2xl shadow-md'>
        <motion.div 
          className='flex flex-col col-span-3 mx-auto w-80 mt-2'
          initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.3,
              duration: .21,
          }}
        >

          {formStep === 1 && (
            <DateRange 
              ranges={[selectionRange]}
              minDate={new Date()}
              rangeColors={['#00c3ff']}
              onChange={handleSelect}
            />
          )} 
          
          <div className='flex items-center border-b mb-4'>
            <h2 className='text-sm lg:text-xl flex-grow font-semibold '>Número de pasajeros</h2>
            <UsersIcon className='h-5' />
            <input 
              type="number" 
              inputmode="numeric"
              className='w-12 pl-2 text-2xl outline-none text-blue-app'
              name='numOfGuests'
              value={bookingState.numOfGuests}
              onChange={bookingStateChange}
              min={0}
            />
          </div>

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
                <h2 className='text-sm lg:text-xl flex-grow font-semibold '>Número de maletas</h2>
                <FaLuggageCart className='h-10 text-lg' />
                <input 
                  type="number" 
                  inputmode="numeric"
                  className='w-12 pl-2 text-2xl outline-none text-blue-app'
                  name='numOfBags'
                  value={bookingState.numOfBags}
                  onChange={bookingStateChange}
                  min={1}
                />
              </div>
              <div className='flex items-center border-b mb-4'>
                <h2 className='text-sm lg:text-xl flex-grow font-semibold '>Número de bicicletas</h2>
                <GiCycling className='h-10 text-lg' />
                <input 
                  type="number" 
                  inputmode="numeric"
                  className='w-12 pl-2 text-2xl outline-none text-blue-app'
                  name='numOfBikes'
                  value={bookingState.numOfBikes}
                  onChange={bookingStateChange}
                  min={0}
                />
              </div>
              <div className='flex items-center border-b mb-4'>
                <h2 className='text-sm lg:text-xl flex-grow font-semibold '>Silla de bebe</h2>
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
                if(formStep === 2){
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
                if(formStep === 1){
                  return nextStep()
                }
                return search()
              }}
            >
              <span className='text-sm lg:text-lg cursor-pointer'>
                Reservar
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
