import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
  deleteUser,
  signOut,
  AuthErrorCodes,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { AuthData } from "firebase-functions/lib/common/providers/https";

import { Db, getFirebase } from ".";
import { User, BaseUser, LoginPayload } from "../types/user";
import { AuthError } from "../exceptions";
import { Post } from "../types/post";

class PostDb extends Db {
  static _collection = "posts";
}

export const getPosts = async () => PostDb.getDocs<Post>();

export default { getPosts };
