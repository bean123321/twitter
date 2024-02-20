import React, { useContext, useState } from "react";
import "../css/Auth.css";
import axios from "axios";
import AppContext from "./AppContext";
import { useNavigate } from "react-router";
import { observer } from "mobx-react";
import axiosInstance from "./axiosInstance";
import { makeAutoObservable, observable, action } from "mobx";
class LoginStore {
  userInput = { email: "", password: "" };
  errorMessage = null;
  constructor() {
    makeAutoObservable(this);
  }
  setUserInput(newUserInput) {
    this.userInput = newUserInput;
  }
  setErrorMessage(message) {
    this.errorMessage = message;
  }
  clearInput() {
    this.userInput = { email: "", password: "" };
  }
}
const loginStore = new LoginStore();

const Login = observer(() => {
  const store = useContext(AppContext);
  console.log({ store });
  //const { dispatch } = useContext(AppContext);
  //const [userInput, setUserInput] = useState({ email: "", password: "" });
  //const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const onChangeHandle = (e) => {
    loginStore.setUserInput({
      ...loginStore.userInput,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmitHandle = async (e) => {
    try {
      e.preventDefault();
      const option = {
        method: "post",
        url: "/api/v1/auth/login",
        data: loginStore.userInput,
      };
      const response = await axiosInstance(option);
      console.log(response);
      // console.log("******************", response);
      const { refresh_token, access_token, userName } = response.data.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      //dispatch({ type: "CURRENT_USER", payload: { userName } });
      store.setCurrentUser({ userName });
      loginStore.clearInput();
      navigate("/");
    } catch (error) {
      //console.log(error);
      loginStore.setErrorMessage(error.response.data.message);
    }
  };
  return (
    <section className="auth-container">
      <form className="auth-form" onSubmit={onSubmitHandle}>
        <h2>Enter Your Account</h2>
        {loginStore.errorMessage && (
          <div className="error-message">Error: {loginStore.errorMessage}</div>
        )}
        <input
          type="email"
          name="email"
          id=""
          required
          placeholder="Email"
          value={loginStore.userInput.email}
          onChange={onChangeHandle}
        />
        <input
          type="password"
          name="password"
          id=""
          required
          placeholder="Password"
          value={loginStore.userInput.password}
          onChange={onChangeHandle}
        />
        <button className="btn" type="submit">
          Login
        </button>
      </form>
    </section>
  );
});

export default Login;
