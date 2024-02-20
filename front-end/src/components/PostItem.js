import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "./axiosInstance";
import AppContext from "./AppContext";
import { observer } from "mobx-react";
import { makeAutoObservable } from "mobx";

export class PostItemStore {
  postToEdit = null;
  openEditForm = false;
  openDeleteConfirm = false;
  dateUpdate = new Date();

  constructor(post) {
    makeAutoObservable(this);
    this.postToEdit = post;
  }

  /*setPost(postItem) {
    this.postToEdit = postItem;
    this.dateUpdate = new Date(postItem.updatedAt);
  }*/

  setPostToEdit(post) {
    this.postToEdit = post;
  }

  setOpenEditForm(value) {
    this.openEditForm = value;
  }

  setOpenDeleteConfirm(value) {
    this.openDeleteConfirm = value;
  }

  setDateUpdate(date) {
    this.dateUpdate = date;
  }
}

const PostItem = observer(({ postItem }) => {
  const store = useContext(AppContext);
  const [postItemStore, setPostItemStore] = useState(
    () => new PostItemStore(postItem)
  );

  //const { dispatch } = useContext(AppContext);
  useEffect(() => {
    setPostItemStore(() => new PostItemStore(postItem));
  }, [postItem]);

  const updatePost = async () => {
    try {
      postItemStore.setOpenEditForm(false);
      const token = localStorage.getItem("token");
      const option = {
        method: "put",
        url: `api/v1/posts/${postItem._id}`,
        data: postItemStore.postToEdit,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axiosInstance(option);
      /*dispatch({
        type: "UPDATE_ONE_POST",
        payload: { ...postItemStore.postToEdit },
      });*/
      store.updatePost({ ...postItemStore.postToEdit });

      postItemStore.setDateUpdate(new Date()); // Cập nhật ngày cập nhật mới
    } catch (error) {
      console.log(error.response);
    }
  };

  const deletePost = async () => {
    try {
      const token = localStorage.getItem("token");
      const option = {
        method: "delete",
        url: `api/v1/posts/${postItem._id}`,
        data: postItemStore.postToEdit,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axiosInstance(option);
      store.deletePost({ ...postItemStore.postToEdit });
      /*dispatch({
        type: "DELETE_ONE_POST",
        payload: { _id: postItem._id },
      });*/
    } catch (error) {
      console.log(error.response);
    }
  };

  let date = new Date(postItem.createdAt);
  return (
    <div className="post-item">
      <div className="post-content">
        <p>{postItem?.content}</p>
        <div className="post-footer">
          <div className="post-infos">
            <span>by {postItem?.author?.name} </span>
            <span>
              Date Created:
              {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}
            </span>
            <span>
              Date Updated:
              {`${postItemStore.dateUpdate.getDate()}/${
                postItemStore.dateUpdate.getMonth() + 1
              }/${postItemStore.dateUpdate.getFullYear()}`}
            </span>
          </div>
          {/* {console.log(postItemStore.postToEdit)} */}
          {postItem.isEditable && (
            <div className="post-edit-delete">
              {postItemStore.openDeleteConfirm ? (
                <>
                  <span className="delete-question">Are you sure?</span>
                  <span onClick={deletePost}>Yes</span>
                  <span
                    onClick={() => postItemStore.setOpenDeleteConfirm(false)}
                  >
                    No
                  </span>
                </>
              ) : (
                <>
                  <span onClick={() => postItemStore.setOpenEditForm(true)}>
                    Edit
                  </span>
                  <span
                    onClick={() => postItemStore.setOpenDeleteConfirm(true)}
                  >
                    Delete
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        {postItemStore.openEditForm && (
          <div className="post-edit-form">
            <form className="edit-form">
              <textarea
                type="text"
                name="content"
                id="content"
                className="content"
                placeholder="What's happening"
                value={postItemStore.postToEdit?.content}
                onChange={(e) =>
                  postItemStore.setPostToEdit({
                    ...postItemStore.postToEdit,
                    content: e.target.value,
                  })
                }
              ></textarea>
              <div className="btn-container">
                <button className="btn" type="button" onClick={updatePost}>
                  Update
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() => postItemStore.setOpenEditForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
});

export default PostItem;
