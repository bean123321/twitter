import React, { useContext, useState } from "react";
import "../css/Form.css";
import axios from "axios";
import AppContext from "./AppContext";
import { observer } from "mobx-react";
import axiosInstance from "./axiosInstance";
import { makeAutoObservable, observable, action } from "mobx";
class FormStore {
  postInput = { content: "" };
  errorMessage = null;
  constructor() {
    makeAutoObservable(this);
  }
  setPostInput(newPostInput) {
    this.postInput = newPostInput;
  }
  setErrorMessage(message) {
    this.errorMessage = message;
  }
}
const formStore = new FormStore();
const Form = observer(() => {
  const store = useContext(AppContext);
  //const { state, dispatch } = useContext(AppContext);
  //const { user } = state;
  //const [postInput, setPostInput] = useState({ content: "" });
  //const [errorMessage, setErrorMessage] = useState(null);
  const onSubmitHandle = async (e) => {
    try {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const option = {
        method: "post",
        url: "/api/v1/posts/",
        data: formStore.postInput,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axiosInstance(option);
      //console.log(response);

      const { post } = response.data.data;
      const author = { _id: post.author, name: store.user?.userName };
      /*dispatch({
        type: "CREATE_ONE_POST",
        payload: { ...post, author, isEditable: true },
      });*/
      store.createPost({ ...post, author, isEditable: true });
      //reset post
      formStore.setPostInput({ content: "" });
    } catch (error) {
      formStore.setErrorMessage(error.response.data.message);
    }
  };
  return (
    <section className="form-section">
      {formStore.errorMessage && (
        <div className="error-message">Error: {formStore.errorMessage}</div>
      )}
      <form className="form">
        <textarea
          type="text"
          name="content"
          id="content"
          className="content"
          placeholder="What's happening"
          value={formStore.postInput.content}
          onChange={(e) =>
            formStore.setPostInput({
              ...formStore.postInput,
              [e.target.name]: e.target.value,
            })
          }
        ></textarea>
        <button className="btn" type="submit" onClick={onSubmitHandle}>
          Tweet
        </button>
      </form>
    </section>
  );
});
export default Form;
