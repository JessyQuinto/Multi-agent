import React from 'react';
import { makeStyles, Title1, Text, tokens } from "@fluentui/react-components";
import { WrenchRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: "40px",
    textAlign: "center",
    gap: "16px",
  },
  icon: {
    fontSize: "64px",
    color: tokens.colorBrandForeground1,
  },
});

const App: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <WrenchRegular className={styles.icon} />
      <Title1>404</Title1>
      <Text size={500}>We are working to make this section available soon.</Text>
    </div>
  );
};

export default App;