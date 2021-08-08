import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import AppBeforeLogin from "./AppBeforeLogin";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Auth0Provider
        domain="dev-flcv5t95.eu.auth0.com"
        // domain="login.marketwise.one"
        clientId="T7rVjI9ytqNnC611PyzzoVc06iCGoTr1"
        redirectUri={window.location.origin}
        audience="https://dev-flcv5t95.eu.auth0.com/api/v2/"
        // audience="https://login.marketwise.one/api/v2/"
        scope="read:current_user update:current_user_metadata"
        useRefreshTokens={true}
        cacheLocation="localstorage"
      >
        <AppBeforeLogin />
      </Auth0Provider>
    </Router>
  </React.StrictMode>,
  rootElement
);
