import { db } from '../../../services/FirebaseService';
import { RoadMapProps } from '../domain/types';
import { doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export class RoadMap {
  async create(roadMap: RoadMapProps): Promise<void> {
    try {
      if (!roadMap.id) {
        throw new Error("El ID del documento es obligatorio");
      }

      const { id, ...data } = roadMap;
      const roadMapRef = doc(db, "road-maps", id);

      await setDoc(roadMapRef, data);
      toast.success('Documento creado');
    } catch (error) {
      console.error("Error al crear el documento:", error);
    }
  }
}
