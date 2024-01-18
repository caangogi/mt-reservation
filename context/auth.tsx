import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../services/FirebaseService';
import { CreateUser } from '../backend/user/aplication/Create';
import { User } from '../backend/share/types';
import firebase from 'firebase/compat';

type AuthContextType = {
  currentUser: firebase.User | null;
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
  const [loading, setLoading] = useState(false);
  const createUser = new CreateUser();

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
          type: 'driver',
        })
      }
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
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  useEffect(() => {
    setLoading(true)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    currentUser,
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
