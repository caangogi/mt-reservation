import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../components/hooks/WithAuth';
import BookingTable from '../../components/tables/BookingTable'
import { onSnapshot, collection, query } from "firebase/firestore";
import { db } from '../../services/FirebaseService';
import { BookingState } from '../../backend/share/types';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';

const RoutesMapList: React.FC = () => {
     
    const { userProfile } = useAuth();
    const Router = useRouter();
    const [bookingStates, setBookingStates] = useState<BookingState[]>([]);
    const bookingQ = query(collection(db, 'bookings'));


    if (userProfile && userProfile.type !== 'admin') {
          toast.error('Acceso denegado');
          Router.push('/login');
          return <></>;
    }

    useEffect(() => {
      const unsubscribe = onSnapshot(bookingQ, (snapshot) => {
        const bookingsData: BookingState[] = [];
        snapshot.forEach((doc) => {
          bookingsData.push({
            ...doc.data() as BookingState
        });
        });
        setBookingStates(bookingsData);
      });
      return () => unsubscribe();
    }, []);
  
    return (
      <>
        <div className="container mx-auto px-4 py-24">
          <h1 className="text-2xl font-bold mb-4">Lista de Reservas</h1>
          <BookingTable bookingStates={bookingStates} />
        </div>
      </>
    );
};

export default withAuth(RoutesMapList);