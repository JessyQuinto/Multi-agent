import React from "react";
import {
  makeStyles,
  Input,
  Label,
  Button,
  Checkbox,
  tokens,
  Title3,
  Text,
} from "@fluentui/react-components";
import { RocketRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  container: {
    width: "100%",
    height: "100vh",
    backgroundColor: "#e9eef7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  box: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    width: "900px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 10px 35px rgba(0, 0, 0, 0.15)",
  },
  left: {
    background: "linear-gradient(to bottom, #1e64ff, #3aa2ff)",
    color: tokens.colorNeutralForegroundOnBrand,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },
  leftContent: {
    maxWidth: "300px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  icon: {
    fontSize: "60px",
    marginBottom: "20px",
  },
  right: {
    padding: "50px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "16px",
  },
  formTitle: {
    marginBottom: "8px",
    color: tokens.colorNeutralForeground1,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  btnRow: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  btnFull: {
    width: "100%",
  },
});

const AuthPage: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.left}>
          <div className={styles.leftContent}>
            <RocketRegular className={styles.icon} />
            <Title3 style={{ color: "white" }}>Welcome to Service Desk Agent</Title3>
            <Text style={{ color: "white", marginTop: "10px" }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Accusantium velit minima repellendus!
            </Text>
          </div>
        </div>
        <div className={styles.right}>
          <Title3 className={styles.formTitle}>Create your account</Title3>

          <div className={styles.field}>
            <Label required>Name</Label>
            <Input placeholder="Enter your name" size="large" />
          </div>

          <div className={styles.field}>
            <Label required>E-mail Address</Label>
            <Input placeholder="Enter your email" size="large" />
          </div>

          <div className={styles.field}>
            <Label required>Password</Label>
            <Input type="password" placeholder="Enter your password" size="large" />
          </div>

          <div>
            <Checkbox label="I agree with Terms & Conditions" />
          </div>

          <div className={styles.btnRow}>
            <Button appearance="primary" size="large" className={styles.btnFull}>
              Sign Up
            </Button>
            <Button size="large" className={styles.btnFull}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
