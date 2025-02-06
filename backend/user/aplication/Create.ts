import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "../../../services/FirebaseService";
import { User } from "../../share/types";

export class CreateUser {
  async create(user: User): Promise<void> {
    try {
      const userRef = doc(collection(db, "users"), user.uid);
      await setDoc(userRef, {
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
