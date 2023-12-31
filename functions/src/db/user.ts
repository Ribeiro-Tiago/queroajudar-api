import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  deleteUser,
  signOut,
  AuthErrorCodes,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { AuthData } from "firebase-functions/lib/common/providers/https";

import { Db, getAuth } from "./";
import { User, BaseUser, LoginPayload } from "../types/user";
import { AuthError } from "../exceptions";

class UserDb extends Db {
  static _collection = "users";
}

export const registerUser = async (user: BaseUser): Promise<User> => {
  const auth = getAuth();
  // create user in firebase auth
  const { user: authUser } = await createUserWithEmailAndPassword(
    auth,
    user.email,
    user.password
  );

  delete user.password;

  try {
    // create user in users db with same id
    await UserDb.setDoc(authUser.uid, user);
    // we do this seprate in case setDoc fails, we don't want to send email
    await sendEmailVerification(authUser);

    // firebase auto signs in on account creation.
    // we want user to verify email before logging in
    signOut(auth);
  } catch (err) {
    // something went wrong creating user in users db. Delete user from auth
    await deleteUser(authUser);
    throw err;
  }

  return { ...user, id: authUser.uid };
};

export const loginUser = async ({ email, password }: LoginPayload) => {
  const { user } = await signInWithEmailAndPassword(getAuth(), email, password);
  console.log("nope");

  if (!user.emailVerified) {
    throw new AuthError(
      AuthErrorCodes.UNVERIFIED_EMAIL,
      "Email ainda não foi confirmado"
    );
  }

  const [details, token] = await Promise.all([
    UserDb.getDoc<User>(user.uid),
    user.getIdToken(),
  ]);

  return { user: { id: user.uid, ...details }, token: token };
};

export const logoutUser = async () => signOut(getAuth());

export const resetUserPasswordEmail = async (email: string) => {
  return await sendPasswordResetEmail(getAuth(), email);
};
