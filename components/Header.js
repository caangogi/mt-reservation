import Image from 'next/image'
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';
import { useRouter } from 'next/dist/client/router';
import Logo from '../public/images/logo_02.png';
import BookingForm from './forms/BookingForm'

function Header({placeholder, setToBooking, toBooking}) {

    const router = useRouter()

  return (
    <header 
      className='fixed top-0 z-50 md:px-10 flex-col w-full h-5'
    >
      <div className='flex flex-col gap-4 justify-around items-center lg:flex-row bg-white p-2  rounded-2xl lg:rounded-full shadow-md'>
        
        <div 
          className={`relative  items-center gap-3 cursor-pointer flex`}
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

        <BookingForm 
          setToBooking = {setToBooking}
          toBooking = {toBooking}
          placeholder = {placeholder}
        />
          

      </div>


    </header>
  ) 
}

export default Header
