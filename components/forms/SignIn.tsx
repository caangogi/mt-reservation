import React, { useState } from 'react';
import { useAuth } from '../../context/auth';
import Link from 'next/link';
import GreatLoader from '../loaders/GreatLoader';
import { useRouter } from 'next/navigation';

const LoginForm: React.FC = () => {

  const { signIn, currentUser, loading } = useAuth();
  const router = useRouter();
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
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-md shadow-md">
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-4"
          />
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