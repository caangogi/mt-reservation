import React, { useState } from 'react'
import Image from 'next/image'
import { SearchIcon, GlobeAltIcon, MenuIcon, UserCircleIcon, UsersIcon } from '@heroicons/react/solid'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {DateRange} from 'react-date-range';
import { useRouter } from 'next/dist/client/router';
import {mallorcaMunicipios} from '../components/data/MarllorcaMunicipios';
import Logo from '../public/images/logo_whitout_text.png';

function Header({placeholder}) {

  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [noOfGuests, setNoOfGuests] = useState(1);
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
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion);
    setSuggestions([]);
  };
  
 
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
        noOfGuests
      }
    })
  }

  return (
    <header className='sticky top-0 z-50 flex justify-between items-center lg:flex-row bg-white shadow-md p-5 md:px-10 flex-col gap-4'>

        <div 
          className='relative flex items-center gap-3 h-10 cursor-pointer my-auto'
          onClick={() => router.push('/')}
        >
          <Image 
              src={Logo}
              width={50}
              height={50}
          />
          <div className='block'>
            <p className='text-xl text-blue-app'>Mallorca Transfer</p>
            <span className='text-xs text-blue-app'> Big One For Groups</span>
        </div>
        </div>
      
       <div className='flex items-center flex-col lg:flex-row  justify-around gap-3 w-fit'>
        <div className='flex items-center border-2 rounded-full py-2 pl-3 shadow-sm'>
            <span className='text-sm lg:text-lg'>Desde el aeropuerto</span>
            <input 
              className='pl-1 lg:pl-5 bg-transparent outline-none flex-grow text-sm lg:text-lg text-gray-600 placeholder-gray-400' 
              type="text" 
              placeholder={placeholder || "Buscar destino"}
              value={searchInput}
              onChange={handleSearchInput}
            />
            <SearchIcon className='md:inline-flex h-8 bg-blue-app text-white rounded-full p-2 cursor-pointer mx-2'/>
            
          </div>
        
          <div className='flex items-center border-2 rounded-full py-2 pl-3 shadow-sm' >
            <span className='text-sm lg:text-lg'>Hacia el aeropuerto</span>
            <input 
              className='pl-1 lg:pl-5 bg-transparent outline-none flex-grow text-sm lg:text-lg text-gray-600 placeholder-gray-400' 
              type="text" 
              placeholder={placeholder || "Buscar origen"}
              value={searchInput}
              onChange={handleSearchInput}
            />
            <SearchIcon className='md:inline-flex h-8 bg-blue-app text-white rounded-full p-2 cursor-pointer mx-2'/>
            
          </div>
       </div>

        <ul className="suggestions-list">
            {suggestions.map((suggestion) => (
              <li key={suggestion} onClick={() => handleSuggestionClick(suggestion)}>{suggestion}</li>
            ))}
        </ul>

      {searchInput && (
        <div className='flex flex-col col-span-3 mx-auto'>
          <DateRange 
            ranges={[selectionRange]}
            minDate={new Date()}
            rangeColors={['#00c3ff']}
            onChange={handleSelect}
          />
          <div className='flex items-center border-b mb-4'>
            <h2 className='text-2xl flex-grow font-semibold '>Número de pasajeros</h2>
            <UsersIcon className='h-5' />
            <input 
              type="number" 
              className='w-12 pl-2 text-lg outline-none text-blue-app'
              value={noOfGuests}
              onChange={e => setNoOfGuests(e.target.value)}
              min={1}
            />
          </div>
          <div className='flex '>
            <button 
              className='flex-grow'
              onClick={() => setSearchInput("")}
            >
              Cancel
            </button>
            <button 
              className='flex-grow text-blue-app'
              onClick={search}
            >
              Search
            </button>
          </div>
        </div>
      )}

    </header>
  ) 
}

export default Header
