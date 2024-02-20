import { makeAutoObservable } from "mobx";

class AppState {
  user = null;
  posts = [];

  constructor() {
    makeAutoObservable(this);
  }

  setCurrentUser(user) {
    this.user = user;
  }

  getAllPosts(posts) {
    this.posts = posts;
  }

  createPost(post) {
    this.posts.push(post);
  }

  updatePost(updatedPost) {
    this.posts = this.posts.map((post) =>
      post._id === updatedPost._id ? { ...post, ...updatedPost } : post
    );
  }

  deletePost(postId) {
    this.posts = this.posts.filter((post) => post._id !== postId._id);
  }
}

// Create a single instance of the observable class to use throughout your application
const appState = new AppState();

export default appState;
