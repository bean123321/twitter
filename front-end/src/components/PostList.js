import React, { useCallback, useContext, useEffect } from "react";
import PostItem from "./PostItem";
import "../css/Post.css";
import axios from "axios";
import axiosInstance from "./axiosInstance";
import AppContext from "./AppContext";
import { PostItemStore } from "./PostItem";
import { observer } from "mobx-react";
const PostList = observer(() => {
  const store = useContext(AppContext);
  //const { state, dispatch } = useContext(AppContext);
  //const { posts, user } = state;
  const getAllPosts = useCallback(async () => {
    try {
      const option = {
        method: "get",
        url: "api/v1/posts",
      };
      const response = await axiosInstance(option);
      const posts = response.data.data.posts;

      //console.log(posts);

      //dispatch({ type: "GET_ALL_POSTS", payload: posts });
      store.getAllPosts([...posts]);
      // console.log("post", posts);
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getAllPosts();
  }, []);
  const newPosts = store.posts.map((post) => {
    if (store && store.user?.userName) {
      return post.author.name === store.user.userName
        ? { ...post, isEditable: true }
        : { ...post, isEditable: false };
    } else {
      return { ...post, isEditable: false };
    }
  });
  return (
    <section className="post-section">
      <div className="post-list">
        {newPosts &&
          newPosts.map((post, index) => {
            // console.log(index, post);
            // const postItemStore = new PostItemStore();

            return (
              <PostItem
                postItem={post}
                key={post._id}
                // postItemStore={postItemStore}
              />
            );
          })}
      </div>
    </section>
  );
});

export default PostList;
