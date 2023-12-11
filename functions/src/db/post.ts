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
import { Post, NewPost } from "../types/post";

class PostDb extends Db {
  static _collection = "posts";
}

export const getPosts = async () => PostDb.getDocs<Post>();

export const getPost = async (id: string) => PostDb.getDoc<Post>(id);

export const addPost = async (post: NewPost): Promise<Post> => {
  const { id } = await PostDb.addDoc(post);

  return await getPost(id);
};

export default { getPosts, addPost };
