import React, { useState } from 'react';
import { useAuth } from '../../context/auth';
import { User } from '../../backend/share/types';
import Link from 'next/link';
import GreatLoader from '../loaders/GreatLoader';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash  } from "react-icons/fa";

const SignupForm: React.FC = () => {
  const { signup, currentUser, loading } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User>({
    name: '',
    lastName: '',
    documentType: '',
    documentID: '',
    phone: '',
    email: '',
    type: 'driver',
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    setError('');
    try {
      await signup(user.email, password, user);
    } catch (error) {
      setError('Error al registrar usuario');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  if (currentUser) {
    router.push('/admin/create-road-map');
    return null;
  }


  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-md shadow-md">
     
        <div>
          <p className="text-center text-lg font-bold mb-4">Registro</p>
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            name='email'
            value={user.email}
            onChange={handleInputChange}
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
          <label className="block mb-2">Nombre:</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md mb-4"
          />
          <label className="block mb-2">Apellido:</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md mb-4"
          />
          <label className="block mb-2">Tipo de Documento:</label>
          <input
            type="text"
            name="documentType"
            value={user.documentType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md mb-4"
          />
          <label className="block mb-2">Número de Documento:</label>
          <input
            type="text"
            name="documentID"
            value={user.documentID}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md mb-4"
          />
          <label className="block mb-2">Teléfono:</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md mb-4"
          />
          {!loading ? 
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
            onClick={handleSignup}
          >
            Registrarse
          </button>
          : 
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md flex"
          >
              {'Un momento...'} <GreatLoader />
          </button>
          }
          <p className="mt-4 text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/signin" legacyBehavior>
              <a className="text-blue-500 cursor-pointer">Accede desde aquí</a>
            </Link>
          </p>
        </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default SignupForm;
