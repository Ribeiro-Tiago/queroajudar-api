import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
  deleteUser,
  signOut,
  AuthErrorCodes,
} from "firebase/auth";
import { Db, getFirebase } from "./";
import { User, BaseUser, LoginPayload } from "../types/user";
import { AuthError } from "../exceptions";

class UserDb extends Db {
  static _collection = "users";
}

const auth: Auth = (() => getAuth(getFirebase()))();

export const registerUser = async (user: BaseUser): Promise<User> => {
  // create user in firebase auth
  const authUser = await createUserWithEmailAndPassword(auth, user.email, user.password);

  delete user.password;

  try {
    // create user in users db with same id
    await UserDb.setDoc(authUser.user.uid, user);

    // firebase auto signs in on account creation.
    // we want user to verify email before logging in
    signOut(auth);
  } catch (err) {
    // something went wrong creating user in users db. Delete user from auth
    await deleteUser(authUser.user);
    throw err;
  }

  return { ...user, id: authUser.user.uid };
};

export const loginUser = async ({ email, password }: LoginPayload) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);

  if (!user.emailVerified) {
    throw new AuthError(AuthErrorCodes.UNVERIFIED_EMAIL, "Email ainda não foi confirmado");
  }

  const [details, token] = await Promise.all([UserDb.getDoc<User>(user.uid), user.getIdToken()]);

  return { user: { id: user.uid, ...details }, token: token };
};
