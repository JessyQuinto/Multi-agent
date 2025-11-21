import React from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import UserComponent from "./User";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0 20px",
    height: "60px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
});

const HeaderComponent: React.FC = () => {
  const styles = useStyles();
  return (
    <header className={styles.root}>
      <UserComponent />
    </header>
  );
};
export default HeaderComponent;
