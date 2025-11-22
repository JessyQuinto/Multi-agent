import React from "react";
import {
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Avatar,
  Button,
  Text,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { SignOutRegular } from "@fluentui/react-icons";
import { useMsal } from "@azure/msal-react";
import type { AccountInfo } from "@azure/msal-browser";

const useStyles = makeStyles({
  card: {
    width: "250px",
    padding: "0",
    border: "none",
  },
  header: {
    textAlign: "center",
    padding: "16px",
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  name: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  email: {
    color: tokens.colorNeutralForeground2,
  },
  logoutBtn: {
    marginTop: "12px",
    width: "100%",
  },
});

const ChromeProfilePopover: React.FC = () => {
  const styles = useStyles();
  const { accounts , instance } = useMsal();
  const account: AccountInfo | undefined = accounts[0];

  return (
    <Popover>
      <PopoverTrigger disableButtonEnhancement>
        <Avatar name="Carolina Ruiz" style={{ cursor: "pointer" }} />
      </PopoverTrigger>

      <PopoverSurface>
        <div className={styles.card}>
          <div className={styles.header}>
            <Avatar size={64} name={account?.name} />
            <div>
              <Text className={styles.name}>{account?.name}</Text>
            </div>
            <div>
              <Text className={styles.email}>{account?.username}</Text>
            </div>
          </div>

          <Button
            appearance="subtle"
            className={styles.logoutBtn}
            icon={<SignOutRegular />}
            onClick={() => instance.logoutRedirect()}
          >
            Logout
          </Button>
        </div>
      </PopoverSurface>
    </Popover>
  );
};

export default ChromeProfilePopover;
