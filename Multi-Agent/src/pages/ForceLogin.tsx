import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { Navigate } from "react-router-dom";
import { InteractionStatus } from "@azure/msal-browser";
import { useEffect, useRef } from "react";
import FullScreenSpinner from "./FullScreenSpinner";


export default function ForceLogin() {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const hasAttemptedLogin = useRef(false);

  useEffect(() => {
    if (
      !isAuthenticated &&
      inProgress === InteractionStatus.None &&
      !hasAttemptedLogin.current
    ) {
      hasAttemptedLogin.current = true;
      instance.loginRedirect();
    }
  }, [isAuthenticated, inProgress, instance]);

  if (inProgress !== InteractionStatus.None) {
    return <FullScreenSpinner tip="Procesando autenticación..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <p>Redirigiendo a Microsoft.......</p>;
}
