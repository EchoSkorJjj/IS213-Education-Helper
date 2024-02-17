import "inter-ui/inter.css";

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import customTheme from "~shared/theme";

import { HeadProvider } from "~features/page-header/title/TitleContext";

import App from "./App";

import { AuthProvider } from "~auth/index";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ChakraProvider theme={customTheme}>
        <GoogleOAuthProvider
          clientId={
            import.meta.env.VITE_GOOGLE_CLIENT_ID || "Nothing-Ever-Works"
          }
        >
          <BrowserRouter>
            <AuthProvider>
              <HeadProvider>
                <App />
              </HeadProvider>
            </AuthProvider>
          </BrowserRouter>
        </GoogleOAuthProvider>
      </ChakraProvider>
    </React.StrictMode>,
  );
}
/*
 * Apparently, vite does not natively ship with a service worker.
 * https://stackoverflow.com/questions/69961761/react-js-builds-with-vite-does-not-include-service-worker-ts
 * Hence need to install a module to do it for us.
 * Please check vite.config.ts to configure the service worker.
 */
