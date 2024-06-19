// RoadmapContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import {  collection, query, orderBy, onSnapshot, startAt, startAfter, endAt, limit, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../services/FirebaseService'; 
import { RoadMapProps } from '../backend/road-map/domain/types'; 

interface RoadmapContextProps {
  roadmaps: RoadMapProps[];
  lastInvoiceNumber: string | null;
  loadMore: () => void;
  allDocsLoaded: boolean;
  filterByDate: (startDate: Date, endDate: Date) => void;
}

const RoadmapContext = createContext<RoadmapContextProps | undefined>(undefined);

export const RoadmapProvider: React.FC = ({ children }: { children?: React.ReactNode }) => {
  const [roadmaps, setRoadmaps] = useState<RoadMapProps[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState<string | null>('INV-00000');
  const [allDocsLoaded, setAllDocsLoaded] = useState<boolean>(false); 
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);


  useEffect(() => {
    let q = query(collection(db, 'road-maps'), orderBy('invoiceNumber', 'desc'), limit(10));
    if (lastDoc) {
      q = query(collection(db, 'road-maps'), orderBy('invoiceNumber', 'desc'), startAfter(lastDoc), limit(10));
    }
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setRoadmaps((currentRoadmaps) => {
          let newRoadmapsData: RoadMapProps[] = [...currentRoadmaps];
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              newRoadmapsData.push({
                id: change.doc.id,
                ...change.doc.data() as RoadMapProps
              });
            }
            if (change.type === "modified") {
              newRoadmapsData = newRoadmapsData.map(map => map.id === change.doc.id ? {id: change.doc.id, ...change.doc.data() as RoadMapProps} : map);
            }
            if (change.type === "removed") {
              newRoadmapsData = newRoadmapsData.filter(map => map.id !== change.doc.id);
            }
          });

          if (newRoadmapsData[0]?.invoiceNumber) {
            setLastInvoiceNumber(newRoadmapsData[0].invoiceNumber);
          }
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
  
          return newRoadmapsData;
        });
      }
    });
  
    return () => unsubscribe();
  }, [lastDoc]);


  const loadMore = () => {
    if (allDocsLoaded) {
      return;
    }
  
    const q = query(
      collection(db, 'road-maps'),
      orderBy('invoiceNumber', 'desc'),
      startAfter(lastVisible),
      limit(10)
    );
  
    onSnapshot(q, (snapshot) => {

      if (!snapshot.empty) {
        let newRoadmapsData: RoadMapProps[] = [...roadmaps];
        snapshot.docs.forEach((doc) => {

          console.log('Doc:', doc.data());  

          newRoadmapsData.push({
            id: doc.id,
            ...doc.data() as RoadMapProps
          });
        });
        

        console.log('New Roadmaps Data:', newRoadmapsData);

        setRoadmaps(newRoadmapsData);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
  
        if (snapshot.docs.length < 10) {
          setAllDocsLoaded(true);
        }
      }
    });
  };

  const filterByDate = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
  
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    setRoadmaps([]);

    db.collection('road-maps')
      .where('date', '>=', start)
      .where('date', '<=', end)
      .get()
      .then((querySnapshot) => {
        const filteredRoadmaps = querySnapshot.docs.map((doc) => doc.data() as RoadMapProps);
        setRoadmaps(filteredRoadmaps);
        setLastDoc(null); 
        setAllDocsLoaded(false); 
      });
  };
  
  useEffect(() => {
    loadMore();
  }, []);

  console.log('Last Invoice Number:', lastInvoiceNumber);

  return (
    <RoadmapContext.Provider value={{ roadmaps, lastInvoiceNumber, loadMore, allDocsLoaded, filterByDate }}>
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

