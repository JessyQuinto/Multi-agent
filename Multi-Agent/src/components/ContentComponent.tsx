import React from "react";
import { Outlet } from "react-router-dom";
import { makeStyles, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    margin: "0 16px",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    margin: "16px 0",
    marginBottom: "32px",
    padding: "5px",
    minHeight: "360px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    flexGrow: 1,
  },
});

const ContentComponent: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default ContentComponent;
