import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../services/FirebaseService';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '../backend/share/types';

type ProfileContextType = {
  user: User | null;
  getUserData: (uid: string) => Promise<User | null>;
};

type ProfileProviderProps = {
  children?: ReactNode; 
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const getUserData = async (uid: string): Promise<User | null> => {
    try {
      const userRef = doc(db, 'users', uid);
      const snapshot = await getDoc(userRef);
  
      if (snapshot.exists()) {
        const userData = snapshot.data() as User;
        return userData;
      } else {
        console.log('El usuario no existe');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      return null;
    }
  };

  useEffect(() => {
    // Perform any initial setup or data fetching here
  }, []);

  const value: ProfileContextType = {
    user,
    getUserData,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile debe ser utilizado dentro de un ProfileProvider');
  }
  return context;
};