// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRPEEJHlUsJ44I2OdzeKmheLZ_2z03dk4",
  authDomain: "react-chat-app-4e795.firebaseapp.com",
  projectId: "react-chat-app-4e795",
  storageBucket: "react-chat-app-4e795.appspot.com",
  messagingSenderId: "453119195795",
  appId: "1:453119195795:web:d629feeefee069dbe96b66",
  measurementId: "G-L0T1KML3ZW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db=getFirestore();
export const storage=getStorage();