import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import AppContext from "./AppContext";
import axios from "axios";
import axiosInstance from "./axiosInstance";
import "../css/Auth.css";
import { observer } from "mobx-react";
import { makeAutoObservable } from "mobx";
class RegisterStore {
  userInput = { name: "", email: "", password: "" };
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
    this.userInput = { name: "", email: "", password: "" };
  }
}
const registerStore = new RegisterStore();
const Register = observer(() => {
  //const { dispatch } = useContext(AppContext);
  /*const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    password: "",
  });*/
  //const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const onChangeHandle = (e) => {
    registerStore.setUserInput({
      ...registerStore.userInput,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmitHandle = async (e) => {
    try {
      e.preventDefault();
      const option = {
        method: "post",
        url: "/api/v1/auth/register",
        data: registerStore.userInput,
      };
      const response = await axiosInstance(option);
      // console.log("******************", response);
      const { token, userName } = response.data.data;
      localStorage.setItem("token", token);
      //dispatch({ type: "CURRENT_USER", payload: { userName } });
      registerStore.clearInput();
      navigate("/login");
    } catch (error) {
      registerStore.setErrorMessage(error.response.data.message);
    }
  };
  return (
    <section class="auth-container">
      <form class="auth-form" onSubmit={onSubmitHandle}>
        <h2>Register New Account</h2>
        {registerStore.errorMessage &&
          (Array.isArray(registerStore.errorMessage) ? (
            registerStore.errorMessage.map((err) => (
              <div className="error-message">Error: {err}</div>
            ))
          ) : (
            <div className="error-message">
              Error: {registerStore.errorMessage}
            </div>
          ))}
        <input
          type="text"
          name="name"
          id=""
          placeholder="Name"
          value={registerStore.userInput.name}
          onChange={onChangeHandle}
        />
        <input
          type="email"
          name="email"
          id=""
          placeholder="Email"
          value={registerStore.userInput.email}
          onChange={onChangeHandle}
        />
        <input
          type="password"
          name="password"
          id=""
          placeholder="Password"
          value={registerStore.userInput.password}
          onChange={onChangeHandle}
        />
        <button class="btn" type="submit">
          Register
        </button>
      </form>
    </section>
  );
});
export default Register;
