import React, { useState } from 'react'
import Image from 'next/image'
import { SearchIcon, GlobeAltIcon, MenuIcon, UserCircleIcon, UsersIcon } from '@heroicons/react/solid'
import {FaLuggageCart} from 'react-icons/fa'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {DateRange} from 'react-date-range';
import { useRouter } from 'next/dist/client/router';
import {mallorcaMunicipios} from '../components/data/MarllorcaMunicipios';
import {DataTransfer} from '../components/data/TarifasTransporte';
import Logo from '../public/images/logo_02.png';
import {motion} from 'framer-motion';

import styles from '../styles/datePicker.module.scss'

function Header({placeholder}) {

  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [noOfGuests, setNoOfGuests] = useState(5);
  const [noOfBags, setNoOfBags] = useState(0);
  const [formStep, setFormStep] = useState(1)

  const router = useRouter();

  const handleSelect = (ranges) =>{
      setStartDate(ranges.selection.startDate);
      setEndDate(ranges.selection.endDate);                      
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
  }
 
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key:'selection'
  }

  const search = () =>{
    router.push({
      pathname: '/search',
      query: {
        location: searchInput,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        noOfGuests,
        noOfBags
      }
    })
  }

  const nextStep = () =>{
    return setFormStep(() => formStep + 1)
  }
  const prevStep = () =>{
    return setFormStep(() => formStep - 1)
  }

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };


 

  return (
    <header 
      className='sticky top-0 z-50  p-5 md:px-10 flex-col '
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
            <span className='text-xs text-blue-app'> Big One For Groups</span>
        </div>
        </div>
      
        <div className='flex items-center flex-col lg:flex-row  justify-around gap-3 w-fit'>
        <div className='flex items-center border-2 rounded-full py-2 pl-3 shadow-sm'>
            <span className='text-sm lg:text-lg'>Desde el aeropuerto</span>
            
            <select 
              value={searchInput} 
              onChange={handleSearchInput} 
              defaultValue='Buscar destino'
              className='pl-1 pr-1 lg:pl-5 lg:pr-5 bg-transparent outline-none flex-grow text-sm lg:text-lg text-gray-600 placeholder-gray-400 cursor-pointer'
            >
               <option value="">Buscar destino</option>
              {DataTransfer?.map((item, i) => {
                return(
                  <option key={i} value={item.name}>{item.name}</option>
                )
              })}
            </select>
            <SearchIcon className='md:inline-flex h-8 bg-blue-app text-white rounded-full p-2 cursor-pointer mx-2'/>
            
          </div>
        
         {/*  <div className='flex items-center border-2 rounded-full py-2 pl-3 shadow-sm' >
            <span className='text-sm lg:text-lg'>Hacia el aeropuerto</span>
            <select 
              value={searchInput} 
              onChange={handleSearchInput} 
              defaultValue='Buscar origen'
              className='pl-1 pr-1 lg:pl-5 lg:pr-5 bg-transparent outline-none flex-grow text-sm lg:text-lg text-gray-600 placeholder-gray-400 cursor-pointer'
            >
               <option value="">Buscar origen</option>
              {DataTransfer?.map((item, i) => {
                return(
                  <option key={i} value={item.name}>{item.name}</option>
                )
              })}
            </select>
            <SearchIcon className='md:inline-flex h-8 bg-blue-app text-white rounded-full p-2 cursor-pointer mx-2'/>
            
          </div> */}
        </div>
      </div>

      {searchInput && (
        <div className='bg-white w-96 flex flex-col col-span-3 mx-auto mt-2 border-2  p-4 rounded-2xl shadow-md'>
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
            <h2 className='text-2xl flex-grow font-semibold '>Número de pasajeros</h2>
            <UsersIcon className='h-5' />
            <input 
              type="number" 
              className='w-12 pl-2 text-2xl outline-none text-blue-app'
              value={noOfGuests}
              onChange={e => setNoOfGuests(e.target.value)}
              min={1}
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
                <h2 className='text-2xl flex-grow font-semibold '>Número de maletas</h2>
                <FaLuggageCart className='h-10 text-lg' />
                <input 
                  type="number" 
                  className='w-12 pl-2 text-2xl outline-none text-blue-app'
                  value={noOfBags}
                  onChange={e => setNoOfBags(e.target.value)}
                  min={1}
                />
              </div>
              <div className='flex items-center border-b mb-4'>
                <h2 className='text-2xl flex-grow font-semibold '>Número de maletas</h2>
                <FaLuggageCart className='h-10 text-lg' />
                <input 
                  type="number" 
                  className='w-12 pl-2 text-2xl outline-none text-blue-app'
                  value={noOfBags}
                  onChange={e => setNoOfBags(e.target.value)}
                  min={1}
                />
              </div>
              <div className='flex items-center border-b mb-4'>
                <h2 className='text-2xl flex-grow font-semibold '>Silla de bebe</h2>
                {/* <FaLuggageCart className='h-10 text-lg' /> */}
                <input 
                  type="checkbox" 
                  className='w-12 pl-2 text-2xl outline-none text-blue-app'
                  value={noOfBags}
                  onChange={e => setNoOfBags(e.target.value)}
                  min={1}
                />
              </div>
            </motion.div>
          )}
          

          <div className='text-center m-4'>

            {searchInput != "" &&   (
              <>
                <h1 className='text-2xl text-green-app font-semibold '> Precio: €{calcularPrecio(searchInput, noOfGuests)}  </h1>
              </>
            )}

          </div>

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
              Cancelar
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
              Reservar
            </button>
          </div>

         

        </motion.div>
      </div>
      )}

    </header>
  ) 
}

export default Header
