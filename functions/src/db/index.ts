// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

let app: FirebaseApp | null = null;

export const getFirebase = () => {
  if (app) {
    return app;
  }

  app = initializeApp({
    apiKey: "AIzaSyAiplsapBw5pBrX4SOwHbtd83Xo__fFw5U",
    authDomain: "queroajudar-7a74a.firebaseapp.com",
    projectId: "queroajudar-7a74a",
    storageBucket: "queroajudar-7a74a.appspot.com",
    messagingSenderId: "807555768727",
    appId: "1:807555768727:web:17b2d5e27d7e47a3d564d2",
    measurementId: "G-R0S7KJW8WT",
  });

  return app;
};
