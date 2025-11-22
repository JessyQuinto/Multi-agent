
import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const authenticated = useIsAuthenticated();

  console.log("ProtectedRoute - authenticated:", authenticated);
  if (!authenticated) return <Navigate to="/force-login" replace />;

  return children;
}