import firebase from "firebase/compat/app"
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

export const app = firebase.initializeApp({
    apiKey: "AIzaSyCUM4Q0iS0zSyTTIVYIPgtD_D4_4hPwM7g",
    authDomain: "mallorca-transfer-demo.firebaseapp.com",
    projectId: "mallorca-transfer-demo",
    storageBucket: "mallorca-transfer-demo.appspot.com",
    messagingSenderId: "1029462740479",
    appId: "1:1029462740479:web:79b1e283cdd31592b46bca",
    measurementId: "G-LT3X530NFT"
})

const auth = app.auth();
const db = app.firestore();
const storage = app.storage();
export {auth, db, storage };
export default app; 