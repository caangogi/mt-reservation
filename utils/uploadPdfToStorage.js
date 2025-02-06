import { storage } from "../services/FirebaseService";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const uploadPdfToStorage = (file, id, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!file || !id) {
      reject(new Error("El archivo y el ID son obligatorios"));
      return;
    }

    const storageRef = ref(storage, `invoices/${id}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (onProgress) {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          onProgress(progress);
        }
      },
      (error) => {
        console.error("Error al subir el archivo:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (error) {
          console.error("Error al obtener la URL de descarga:", error);
          reject(error);
        }
      }
    );
  });
};
