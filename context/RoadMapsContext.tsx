// RoadmapContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/FirebaseService'; 
import { RoadMapProps } from '../backend/road-map/domain/types'; 

interface RoadmapContextProps {
  roadmaps: RoadMapProps[];
  lastInvoiceNumber: string | null;
}

const RoadmapContext = createContext<RoadmapContextProps | undefined>(undefined);

export const RoadmapProvider: React.FC = ({ children }: { children?: React.ReactNode }) => {
  const [roadmaps, setRoadmaps] = useState<RoadMapProps[]>([]);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState<string | null>('INV-00000');
  const q = query(collection(db, 'road-maps'), orderBy('invoiceNumber', 'desc'));

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roadmapsData: RoadMapProps[] = [];
      snapshot.forEach((doc) => {
        roadmapsData.push({
          id: doc.id,
          ...doc.data() as RoadMapProps
        });
      });
      setRoadmaps(roadmapsData);
      if (roadmapsData[0]?.invoiceNumber) {
        setLastInvoiceNumber(roadmapsData[0].invoiceNumber);
      }
    });
    return () => unsubscribe();
  }, []);


  return (
    <RoadmapContext.Provider value={{ roadmaps, lastInvoiceNumber }}>
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmaps = (): RoadmapContextProps => {
  const context = useContext(RoadmapContext);
  if (context === undefined) {
    throw new Error('useRoadmaps must be used within a RoadmapProvider');
  }
  return context;
};