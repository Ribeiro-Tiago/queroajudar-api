import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, deleteUser } from "firebase/auth";
import { Db, getFirebase } from "./";
import { User, BaseUser, LoginPayload } from "../types/user";

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
  } catch (err) {
    // something went wrong creating user in users db. Delete user from auth
    await deleteUser(authUser.user);
    throw err;
  }

  return { ...user, id: authUser.user.uid };
};

export const loginUser = async ({ email, password }: LoginPayload) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);

  return { id: user.uid, ...(await UserDb.getDoc(user.uid)) };
};
