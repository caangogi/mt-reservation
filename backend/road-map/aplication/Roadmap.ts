import { db } from '../../../services/FirebaseService';
import { RoadMapProps } from '../domain/types';
import toast from 'react-hot-toast';


export class RoadMap {
  async create(roadMap: RoadMapProps): Promise<void> {
    try {
      const { id, ...data } = roadMap;
      await db.collection("road-maps").doc(id).set(data);
      toast.success('Documento creado')
    } catch (error) {
      console.error("Error al crear el documento:", error);
    }
  }
}
