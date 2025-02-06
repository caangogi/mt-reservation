// RoadmapContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  startAfter,
  limit,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  where,
  getDocs
} from 'firebase/firestore';
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

export const RoadmapProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [roadmaps, setRoadmaps] = useState<RoadMapProps[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState<string | null>('INV-00000');
  const [allDocsLoaded, setAllDocsLoaded] = useState<boolean>(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);

  // Escucha inicial y paginación
  useEffect(() => {
    let q;
    if (lastDoc) {
      q = query(
        collection(db, 'road-maps'),
        orderBy('invoiceNumber', 'desc'),
        startAfter(lastDoc),
        limit(10)
      );
    } else {
      q = query(
        collection(db, 'road-maps'),
        orderBy('invoiceNumber', 'desc'),
        limit(10)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setRoadmaps((currentRoadmaps) => {
          let newRoadmapsData: RoadMapProps[] = [...currentRoadmaps];

          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              newRoadmapsData.push({
                id: change.doc.id,
                ... (change.doc.data() as RoadMapProps)
              });
            }
            if (change.type === "modified") {
              newRoadmapsData = newRoadmapsData.map(map =>
                map.id === change.doc.id
                  ? { id: change.doc.id, ... (change.doc.data() as RoadMapProps) }
                  : map
              );
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

  // Función para cargar más documentos
  const loadMore = () => {
    if (allDocsLoaded || !lastVisible) return;

    const q = query(
      collection(db, 'road-maps'),
      orderBy('invoiceNumber', 'desc'),
      startAfter(lastVisible),
      limit(10)
    );

    // Utilizamos onSnapshot para mantener la escucha activa en la paginación
    onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        let newRoadmapsData: RoadMapProps[] = [...roadmaps];
        snapshot.docs.forEach((doc) => {
          console.log('Doc:', doc.data());
          newRoadmapsData.push({
            id: doc.id,
            ... (doc.data() as RoadMapProps)
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

  // Función para filtrar por fecha
  const filterByDate = async (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Reiniciamos la lista para mostrar solo los resultados filtrados
    setRoadmaps([]);

    // Creamos la query con los filtros de fecha
    const q = query(
      collection(db, 'road-maps'),
      where('date', '>=', start),
      where('date', '<=', end)
    );

    try {
      const querySnapshot = await getDocs(q);
      const filteredRoadmaps = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ... (doc.data() as RoadMapProps)
      }));
      setRoadmaps(filteredRoadmaps);
      setLastDoc(null);
      setAllDocsLoaded(false);
    } catch (error) {
      console.error("Error filtering by date:", error);
    }
  };

  // Carga inicial de más documentos al montar el componente
  useEffect(() => {
    loadMore();
  }, []);

  console.log('Last Invoice Number:', lastInvoiceNumber);

  return (
    <RoadmapContext.Provider
      value={{ roadmaps, lastInvoiceNumber, loadMore, allDocsLoaded, filterByDate }}
    >
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
