import "inter-ui/inter.css";

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@opengovsg/design-system-react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import customTheme from "~shared/theme";

import { AuthProvider } from "~features/auth";

import App from "./App";

const helmetContext = {};

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <ThemeProvider theme={customTheme}>
          <BrowserRouter>
            <AuthProvider>
              <HelmetProvider context={helmetContext}>
                <App />
              </HelmetProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </React.StrictMode>,
  );
}
