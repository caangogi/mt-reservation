
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
 
export const app = initializeApp({
    apiKey: "AIzaSyCUM4Q0iS0zSyTTIVYIPgtD_D4_4hPwM7g",
    authDomain: "mallorca-transfer-demo.firebaseapp.com",
    projectId: "mallorca-transfer-demo",
    storageBucket: "mallorca-transfer-demo.appspot.com",
    messagingSenderId: "1029462740479",
    appId: "1:1029462740479:web:79b1e283cdd31592b46bca",
    measurementId: "G-LT3X530NFT"
})

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export {auth, db, storage };
export default app; 