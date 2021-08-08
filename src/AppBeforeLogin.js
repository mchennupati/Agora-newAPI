import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Route, Link } from "react-router-dom";
import { Nav, Navbar, Container } from "react-bootstrap";

import App from "./App";
import Login from "./Login";
import Logout from "./Logout";

import { AppContextProvider } from "./AppContext";

export default function AppBeforeAuth() {
  let { isAuthenticated } = useAuth0();
  console.log(isAuthenticated);
  return (
    <div>
      {isAuthenticated ? (
        <AppContextProvider>
          <div className="home">
            <Route exact path="/">
              <App />
            </Route>
          </div>
        </AppContextProvider>
      ) : (
        <header className="header">
          <Login />
        </header>
      )}
    </div>
  );
}
