import { useRouter } from 'next/router';
import Image from 'next/image';
import Logo from '/public/images/logo_02.png';
import { useAuth } from '../../context/auth';

const Header = () => {

  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
     return logout()
  };

  return (
    <div className="flex items-center justify-between bg-white px-4 fixed h-20 w-full shadow-md">
      <div 
        className='relative flex flex-col sm:flex-row sm:gap-2 items-center h-10 cursor-pointer '
        onClick={() => router.push('/')}
      >
        <Image 
          src={Logo}
          width={40}
          height={40}
          alt='Mallorca Transfer Logo'
        />
        <div className='sm:flex flex-col hidden'>
          <p className='text-sm sm:text-xl text-blue-app '>Mallorca Transfer</p>
          <span className='text-xs  text-blue-app'>Big One For Groups</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          className=" text-blue-app hover:underline cursor-pointer"
          onClick={() => router.push('/create-road-map')}
        >
          Crear Ruta
        </button>
        <button 
          className=" text-blue-app hover:underline cursor-pointer"
          onClick={() => router.push('/routes-map-list')}
        >
          Ver Rutas
        </button>
        <button 
          className=" text-blue-app hover:underline cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;