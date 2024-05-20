// RoadmapContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import {  collection, query, orderBy, onSnapshot, startAfter, limit, doc, DocumentSnapshot } from 'firebase/firestore';
import { db } from '../services/FirebaseService'; 
import { RoadMapProps } from '../backend/road-map/domain/types'; 
import toast from 'react-hot-toast';

interface RoadmapContextProps {
  roadmaps: RoadMapProps[];
  lastInvoiceNumber: string | null;
  loadMore: () => void;
  allDocsLoaded: boolean;
}

const RoadmapContext = createContext<RoadmapContextProps | undefined>(undefined);

export const RoadmapProvider: React.FC = ({ children }: { children?: React.ReactNode }) => {
  const [roadmaps, setRoadmaps] = useState<RoadMapProps[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState<string | null>('INV-00000');
  const [allDocsLoaded, setAllDocsLoaded] = useState<boolean>(false); 

  const loadMore = () => {

    if (allDocsLoaded) return;

    let q = query(collection(db, 'road-maps'), orderBy('invoiceNumber', 'desc'), limit(10));
    if (lastDoc) {
      q = query(collection(db, 'road-maps'), orderBy('invoiceNumber', 'desc'), startAfter(lastDoc), limit(10));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roadmapsData: RoadMapProps[] = [];
      snapshot.forEach((doc) => {
        roadmapsData.push({
          id: doc.id,
          ...doc.data() as RoadMapProps
        });
      });
      
      if (roadmapsData[0]?.invoiceNumber) {
        setLastInvoiceNumber(roadmapsData[0].invoiceNumber);
      }
      setRoadmaps(prevRoadmaps => [...prevRoadmaps, ...roadmapsData]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      if (snapshot.empty || snapshot.docs.length < 10) {
        setAllDocsLoaded(true);
      }
    });

    return () => unsubscribe();
  }

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <RoadmapContext.Provider value={{ roadmaps, lastInvoiceNumber, loadMore, allDocsLoaded }}>
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

