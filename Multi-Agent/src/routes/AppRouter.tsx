import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutComponent from "../components/LayoutComponent";
import DashboardComponent from "../components/DashboardComponent";
import ChatView from "../components/ChatView";
import TicketComponent from "../components/TicketComponent";
import TicketList from "../components/TicketList";
import UnderConstruction from "../pages/UnderConstruction";
import AuthComponent from "../components/AuthComponent";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutComponent />}>
          <Route path="/" element={<TicketList />} />
          <Route path="/dashboard" element={<DashboardComponent />} />
          <Route path="/chat" element={<ChatView />} />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/settings" element={<UnderConstruction />} />
        </Route>
        {/* Routes that don't use a layout (login, recovery, etc) */}
        {<Route path="/login" element={<AuthComponent />} />}
      </Routes>
    </BrowserRouter>
  );
}
