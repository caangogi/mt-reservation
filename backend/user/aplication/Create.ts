import { db } from "../../../services/FirebaseService";
import { User } from "../../share/types";

export class CreateUser {
  async create(user: User): Promise<void> {
    try {
      await db.collection('users').doc(user.uid).set({
        name: user.name,
        lastName: user.lastName,
        documentType: user.documentType,
        documentID: user.documentID,
        phone: user.phone,
        type: user.type,
      });

      console.log("Usuario creado exitosamente en Firestore");
    } catch (error) {
      console.error("Error al crear el usuario en Firestore:", error);
      throw error;
    }
  }
}
