import React, { useState } from 'react';
import { useAuth } from '../../context/auth';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '/public/logo_02.png';
import GreatLoader from '../loaders/GreatLoader';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash  } from "react-icons/fa";

const LoginForm: React.FC = () => {

  const { signIn, currentUser, loading } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setError('');
    try {
      await signIn(email, password);
    } catch (error) {
      setError('Error al iniciar sesión');
    }
  };

  if (currentUser) {
    router.push('/admin/create-road-map');
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-md shadow-md flex flex-col gap-20 m:w-[400px] w-full"
      style={{height: "500px", border: "1px solid #e5e7eb"}}
    >
       <div 
          className='relative flex flex-col gap-2 items-center h-10 cursor-pointer mb-6 '
          onClick={() => router.push('/')}
        >
          <Image 
            src={Logo}
            width={80}
            height={80}
            alt='Mallorca Transfer Logo'
          />
          <div className='flex flex-col'>
              <p className='text-xl text-blue-app'>Mallorca Transfer</p>
          </div>
        </div>
        <div>
          <p className="text-center text-lg font-bold mb-4">Iniciar Sesión</p>
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-4"
          />
          <label className="block mb-2">Contraseña:</label>
          <div className='flex items-center justify-center mb-4 gap-1 relative'>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md "
            />
            <button onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
         {!loading ? 
           <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
              onClick={handleSignIn}
            >
              {'Iniciar sesión'}
            </button>
          :
          <button
              className="bg-blue-500 text-white text-center px-4 py-2 rounded-md flex w-full"
          >
            {'Un momento...'} <GreatLoader />
          </button>
          }
          <p className="mt-4 text-sm">
            ¿No tienes una cuenta?{' '}
            <Link href="/create-account" legacyBehavior>
              <a className="text-blue-500 cursor-pointer">Regístrate aquí</a>
            </Link>
          </p>
        </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default LoginForm;