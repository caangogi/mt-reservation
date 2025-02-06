import { useRouter } from 'next/router';
import Image from 'next/image';
import Logo from '/public/images/logo_new.jpg';
import { useAuth } from '../../context/auth';
import BurgerButton from '../buttons/BurgerButton';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';


const Header = () => {

  const router = useRouter();
  const { logout, userProfile } = useAuth();
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  const handleLogout = () => {
     return logout()
  };

  return (
    <>
    <div className="flex items-center justify-between bg-white px-4 fixed h-20 w-full shadow-md">
      <div 
        className='relative flex gap-2 items-center h-10 cursor-pointer '
        onClick={() => router.push('/')}
      >
        <Image 
          src={Logo}
          width={100}
          height={100}
          alt='Mallorca Transfer Logo'
        />
      </div>

      {userProfile && userProfile.type === 'admin' ? (
          <div className="flex items-center justify-end gap-4">

            {!isDesktop ? (
                <>
                <div onClick={toggleSidebar}>
                  <BurgerButton />
                </div>
         
                </>
            ):(
              <div className='flex items-center gap-4'>
                <button 
                  className=" text-blue-app hover:underline cursor-pointer"
                  onClick={() => router.push('/admin/create-road-map')}
                >
                    Crear Ruta
                </button>
                <button 
                  className=" text-blue-app hover:underline cursor-pointer"
                  onClick={() => router.push('/admin/routes-map-list')}
                >
                  Ver Rutas
                </button>
                <button 
                  className=" text-blue-app hover:underline cursor-pointer"
                  onClick={() => router.push('/admin/bookings-list')}
                >
                  Ver Reservas
                </button>
                <button 
                    className=" text-blue-app hover:underline cursor-pointer"
                    onClick={handleLogout}
                  >
                    Salir
                </button>
              </div>
            )}
         
          </div>
        ) : (
        <div className="flex items-center gap-4">
          <button 
            className=" text-blue-app hover:underline cursor-pointer"
            onClick={handleLogout}
          >
            Salir
          </button>
  
        </div>
      )}

      <motion.nav
        variants={sidebarVariants}
        initial="closed"
        animate={isSidebarOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 bg-white overflow-auto shadow-xl "
      >

        <div className='flex flex-col items-center justify-center gap-4 h-full'>
            <button 
              className=" text-2xl text-blue-app hover:underline cursor-pointer "
              onClick={() => router.push('/admin/create-road-map')}
            >
                Crear Ruta
            </button>
            <button 
              className=" text-2xl text-blue-app hover:underline cursor-pointer"
              onClick={() => router.push('/admin/routes-map-list')}
            >
              Ver Rutas
            </button>
            <button 
              className=" text-2xl text-blue-app hover:underline cursor-pointer"
              onClick={() => router.push('/admin/bookings-list')}
            >
              Ver Reservas
            </button>
            <button 
                className=" text-2xl text-blue-app hover:underline cursor-pointer"
                onClick={handleLogout}
              >
                Salir
            </button>
          </div>
      </motion.nav>
          
    </div>
    </>
  );
};

export default Header;