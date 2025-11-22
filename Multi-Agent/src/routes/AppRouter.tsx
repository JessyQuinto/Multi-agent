import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutComponent from "../components/LayoutComponent";
import DashboardComponent from "../components/DashboardComponent";
import ChatView from "../components/ChatView";
import TicketList from "../components/TicketList";
import UnderConstruction from "../pages/UnderConstruction";
//import AuthComponent from "../components/AuthComponent";
import ForceLogin from "../pages/ForceLogin";
import ProtectedRoute from "../auth/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---  MSAL --- */}
        <Route path="/force-login" element={<ForceLogin />} />
        {/* Protected Routes that use a layout */}
        <Route
          element={
            <ProtectedRoute>
              <LayoutComponent />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<TicketList />} />
          <Route path="/dashboard" element={<DashboardComponent />} />
          <Route path="/chat" element={<ChatView />} />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/settings" element={<UnderConstruction />} />
        </Route>
        {/* Routes that don't use a layout (login, recovery, etc) */}
        {/*<Route path="/login" element={<AuthComponent />} />*/}
      </Routes>
    </BrowserRouter>
  );
}
