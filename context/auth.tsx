import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../services/FirebaseService";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { CreateUser } from "../backend/user/aplication/Create";
import { User as CustomUser } from "../backend/share/types";

type AuthContextType = {
  currentUser: User | null;
  userProfile: CustomUser | null;
  loading: boolean;
  signup: (email: string, password: string, user: CustomUser) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

type AuthProviderProps = {
  children?: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(false);
  const createUser = new CreateUser();
  const router = useRouter();

  // Función para registrar un usuario
  const signup = async (email: string, password: string, user: CustomUser): Promise<void> => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (res.user?.uid) {
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          name: user.name,
          lastName: user.lastName,
          documentType: user.documentType,
          documentID: user.documentID,
          phone: user.phone,
          email: user.email,
          type: "driver",
        });
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  };

  // Obtener datos del usuario en Firestore
  const getUserById = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        setUserProfile(userSnapshot.data() as CustomUser);
      } else {
        console.log("El usuario no existe");
      }
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    }
  };

  // Listener para cambios en la autenticación
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user?.uid) {
        getUserById(user.uid);
      }
      setLoading(false);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};
