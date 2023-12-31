import { QueryOrderByConstraint } from "firebase/firestore";
import { Db } from ".";
import { Post, NewPost } from "../types/post";

class PostDb extends Db {
  static _collection = "posts";
}

export const getPosts = async (order: QueryOrderByConstraint) => {
  return PostDb.getDocs<Post>({ order });
};

export const getPost = async (id: string) => PostDb.getDoc<Post>(id);

export const addPost = async (post: NewPost): Promise<Post> => {
  const { id } = await PostDb.addDoc(post);

  return await getPost(id);
};

export default { getPosts, addPost };
