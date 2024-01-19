import { storage } from "../services/FirebaseService";

export const uploadPdfToStorage = async (file, id) => {
  try {
    const uploadTask = storage.ref(`invoices/${id}`).put(file);
    const url = await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          
      

        },


        (error) => {
          console.error("Error al subir el archivo:", error);
          reject(error);
        },
        () => {
          storage
            .ref(`invoices/${id}`)
            .getDownloadURL()
            .then((downloadUrl) => {
              resolve(downloadUrl);
            })
            .catch((error) => {
              console.error("Error al obtener la URL de descarga:", error);
              reject(error);
            });
        }
      );
    });

    return url;
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    throw Error(error);
  }
};
