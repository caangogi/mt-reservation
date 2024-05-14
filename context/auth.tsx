import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation'
import { auth, db } from '../services/FirebaseService';
import { doc, getDoc } from 'firebase/firestore';
import { CreateUser } from '../backend/user/aplication/Create';
import { User } from '../backend/share/types';
import firebase from 'firebase/compat';


type AuthContextType = {
  currentUser: firebase.User | null;
  userProfile: User | any;
  loading: boolean;
  signup: (email: string, password: string, user: User) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

type AuthProviderProps = {
  children?: ReactNode; 
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [userProfile, setUserProfile] = useState<User | any>()
  const [loading, setLoading] = useState(false);
  const createUser = new CreateUser();
  const router = useRouter();

  const signup = async (email: string, password: string, user: User): Promise<void> => {
    setLoading(true)
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password);
      if(res && res.user?.uid){
        await createUser.create({
          uid: res.user?.uid, 
          name: user.name,
          lastName: user.lastName,
          documentType: user.documentType,
          documentID: user.documentID,
          phone: user.phone,
          email: user.email,
          type: 'driver',
        })
      };
      
      setLoading(false)
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setLoading(false)

      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setLoading(false)
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setLoading(false)
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  const getUserById = async (userId: string | any) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData  = userSnapshot.data();
        setUserProfile(userData)
      } else {
        console.log('El usuario no existe');
        return null; 
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      return null;
    }
  }

  useEffect(() => {
    setLoading(true)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      getUserById(user?.uid)
      setLoading(false);
      router.push('/admin/create-road-map');
    });
    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    signIn,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children} 
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
