// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import {ReactNativeAsyncStorage} from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4_WdQ81dnS6DNr69CoMZLcqGS6--EXc4",
  authDomain: "carbontrack-c09b5.firebaseapp.com",
  projectId: "carbontrack-c09b5",
  storageBucket: "carbontrack-c09b5.appspot.com",
  messagingSenderId: "949013729784",
  appId: "1:949013729784:web:4efe758f703e7a04a4c60d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize Firebase Authentication and get a reference to the service
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)});
  
//Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);