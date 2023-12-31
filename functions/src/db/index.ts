// Import the functions you need from the SDKs you need
import * as logger from "firebase-functions/logger";

import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth as _getAuth, connectAuthEmulator } from "firebase/auth";
import {
  getDoc,
  setDoc,
  doc,
  getFirestore as _getFirestore,
  addDoc,
  collection,
  DocumentData,
  getDocs,
  query,
  limit as queryLimit,
  QueryOrderByConstraint,
  QueryLimitConstraint,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

let app: FirebaseApp | null = null;
// let db: Firestore | null = null;

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

export const getAuth = (): Auth => {
  const auth = _getAuth(getFirebase());

  if (process.env.NODE_ENV === "development") {
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
  }

  return auth;
};

export class Db {
  static _collection = "";
  static _db = _getFirestore(getFirebase());

  static async addDoc<T extends DocumentData>(payload: T) {
    return await addDoc(collection(this._db, this._collection), payload);
  }

  static async setDoc<T extends DocumentData>(id: string, payload: T) {
    return await setDoc(doc(this._db, this._collection, id), payload);
  }

  static async getDoc<T extends DocumentData>(id: string): Promise<T | null> {
    const result = await getDoc(doc(this._db, this._collection, id));

    return result.exists() ? { ...(result.data() as T), id } : null;
  }

  static async getDocs<T extends DocumentData>({
    order,
    limit,
  }: {
    order?: QueryOrderByConstraint;
    limit?: QueryLimitConstraint;
  }): Promise<T[]> {
    const snapshot = await getDocs(
      query(
        collection(this._db, this._collection),
        order,
        limit || queryLimit(50)
      )
    );

    const result: T[] = [];

    snapshot.forEach((doc) => result.push(doc.data() as T));

    return result;
  }
}
