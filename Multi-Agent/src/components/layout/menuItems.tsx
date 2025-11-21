import {
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

export const menuItems = [
  {
    key: "Tickets",
    icon: <FileTextOutlined />,
    label: <Link to="/tickets">Ticket</Link>,
  },
  {
    key: "Settings",
    icon: <SettingOutlined />,
    label: <Link to="/settings">Setting</Link>,
  },
  {
    key: "Logout",
    icon: <LogoutOutlined />,
    danger: true,
    label: "Logout",
    onClick: () => console.log("logout"),
  },
];
