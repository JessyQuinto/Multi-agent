import React, { useState } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import SiderComponent from "./SiderComponent";
import ContentComponent from "./ContentComponent";
import HeaderComponent from "./HeaderComponent";

const useStyles = makeStyles({
  root: {
    display: "flex",
    height: "100vh",
    backgroundColor: tokens.colorNeutralBackground2,
  },
  main: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    overflowY: "auto", 
    overflowX: "hidden",
  },
  footer: {
    textAlign: "center",
    padding: "16px",
    color: tokens.colorNeutralForeground3,
    fontSize: "12px",
  },
});

const App: React.FC = () => {
  const styles = useStyles();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.root}>
      <SiderComponent collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={styles.main}>
        <HeaderComponent />
        <ContentComponent />
        <footer className={styles.footer}>
          ©{new Date().getFullYear()} Created by DAPAYECA AI team
        </footer>
      </div>
    </div>
  );
};

export default App;
