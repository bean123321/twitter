import React, { useContext } from "react";
import AppContext from "./AppContext";
import "../css/Header.css";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
const Header = observer(() => {
  const store = useContext(AppContext);
  //const { state, dispatch } = useContext(AppContext);
  //const { user } = state;
  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    //reset user to null
    //dispatch({ type: "CURRENT_USER", payload: null });
    store.setCurrentUser(null);
  };
  return (
    <header className="header">
      <h1 className="logo">
        <Link to="/">twitter</Link>
      </h1>
      <nav>
        <ul className="main-nav">
          {console.log(store.user)}
          {store.user ? (
            <>
              <li>
                {console.log(store)}
                <span className="user-name">
                  Hello, {store?.user?.userName}
                </span>
              </li>
              <li onClick={() => signOut()}>
                <a>Sign Out</a>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
});

export default Header;
