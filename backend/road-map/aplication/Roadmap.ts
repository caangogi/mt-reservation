import { db } from '../../../services/FirebaseService';
import { RoadMapProps } from '../domain/types';

export class RoadMap {
  async create(roadMap: RoadMapProps): Promise<void> {
    try {
      const { id, ...data } = roadMap;
      console.log(id)
      await db.collection("road-maps").doc(id).set(data);
      console.log("Documento creado exitosamente");
    } catch (error) {
      console.error("Error al crear el documento:", error);
    }
  }
}
