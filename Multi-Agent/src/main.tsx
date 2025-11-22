import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./auth/authConfig";

import "./styles/index.css";
import App from "./App.tsx";

const msalInstance = new PublicClientApplication(msalConfig);
console.log("msalConfig:", msalConfig);

msalInstance.initialize().then(() => {
  msalInstance.handleRedirectPromise().then(() => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <MsalProvider instance={msalInstance}>
          <FluentProvider theme={webLightTheme}>
            <App />
          </FluentProvider>
        </MsalProvider>
      </StrictMode>
    );
  });
});
