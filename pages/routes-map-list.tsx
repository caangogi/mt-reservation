import React, { useState, useEffect } from 'react';
import withAuth from '../components/hooks/WithAuth';
import { v4 as uuidv4 } from 'uuid';
import RoadmapTable from '../components/tables/RoadMapTable';
import { RoadMapProps } from '../backend/road-map/domain/types';
import { getDocs, onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from '../services/FirebaseService';

const RoutesMapList: React.FC = () => {

    const [roadmaps, setRoadmaps] = useState<RoadMapProps[]>([]);
    const q = query(collection(db, 'road-maps'), orderBy('date', 'desc'));

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
      });
      return () => unsubscribe();
    }, []);
  
    return (
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-2xl font-bold mb-4">Lista de Rutas</h1>
        <RoadmapTable roadmaps={roadmaps} />
      </div>
    );
};

export default withAuth(RoutesMapList);