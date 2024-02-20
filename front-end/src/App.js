import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Main from "./components/Main";
import AppReducer from "./reducers/AppReducer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useCallback, useEffect, useReducer } from "react";
import AppContext from "./components/AppContext";
import axios from "axios";
import appState from "./reducers/AppReducer";
import axiosInstance from "./components/axiosInstance";
function App() {
  //const initialState = { user: null, posts: [] };
  //const [state, dispatch] = useReducer(AppReducer, initialState);
  const checkCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const option = {
        method: "get",
        url: "/api/v1/auth",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axiosInstance(option);
      if (response.data.data.user) {
        const { userName } = response.data.data.user;
        //dispatch({ type: "CURRENT_USER", payload: { userName } });
        appState.setCurrentUser({ userName });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    checkCurrentUser();
  }, [checkCurrentUser]);
  return (
    <Router>
      <AppContext.Provider value={appState}>
        <div className="container">
          <Header />
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/" element={<Main />}></Route>
            <Route path="*" element={<div>Page not found</div>}></Route>
          </Routes>
        </div>
      </AppContext.Provider>
    </Router>
  );
}

export default App;
