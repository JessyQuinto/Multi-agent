import React from "react";
import {
  makeStyles,
  TabList,
  Tab,
  tokens,
  Text,
  Button,
} from "@fluentui/react-components";
import type { SelectTabData } from "@fluentui/react-components";
import {
  HomeRegular,
  TicketDiagonalRegular,
  SettingsRegular,
  SignOutRegular,
  NavigationRegular,
} from "@fluentui/react-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    justifyContent: "space-between",
    paddingBottom: "20px",
    transition: "width 0.3s ease",
  },
  expanded: {
    width: "260px",
  },
  collapsed: {
    width: "80px",
  },
  header: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    color: tokens.colorBrandForeground1,
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  tabList: {
    padding: "0 10px",
  },
  bottomSection: {
    padding: "0 10px",
  },
  toggleButton: {
    minWidth: "32px",
  },
});

interface SiderComponentProps {
  collapsed: boolean;
  onToggle: () => void;
}

const SiderComponent: React.FC<SiderComponentProps> = ({ collapsed, onToggle }) => {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const onTabSelect = (_event: unknown, data: SelectTabData) => {
    navigate(data.value as string);
  };
  const { instance } = useMsal();

  // Map paths to tab values
  const selectedValue = location.pathname === "/" ? "/tickets" : location.pathname;

  return (
    <div className={`${styles.root} ${collapsed ? styles.collapsed : styles.expanded}`}>
      <div>
        <div className={styles.header}>
          {!collapsed && <Text className={styles.logo}>Service Desk</Text>}
          <Button
            appearance="subtle"
            icon={<NavigationRegular />}
            onClick={onToggle}
            className={styles.toggleButton}
            title={collapsed ? "Expandir" : "Contraer"}
          />
        </div>
        <TabList
          selectedValue={selectedValue}
          onTabSelect={onTabSelect}
          vertical
          className={styles.tabList}
        >
          <Tab icon={<HomeRegular />} value="/dashboard">
            {!collapsed && "Dashboard"}
          </Tab>
          <Tab icon={<TicketDiagonalRegular />} value="/tickets">
            {!collapsed && "Tickets"}
          </Tab>
          <Tab icon={<SettingsRegular />} value="/settings">
            {!collapsed && "Settings"}
          </Tab>
        </TabList>
      </div>

      <div className={styles.bottomSection}>
        <TabList vertical>
          <Tab icon={<SignOutRegular />} value="/logout" onClick={() => instance.logoutRedirect()}>
            {!collapsed && "Logout"}
          </Tab>
        </TabList>
      </div>
    </div>
  );
};
export default SiderComponent;
