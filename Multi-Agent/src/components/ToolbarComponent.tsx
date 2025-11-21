import React from "react";
import { Button, Tooltip, makeStyles } from "@fluentui/react-components";
import { ArrowClockwiseRegular, SaveRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  root: {
    width: "100%",
    padding: "8px 12px",
    background: "transparent",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "16px",
  },
  icon: {
    fontSize: "20px",
    color: "#626264",
  },
});

const ToolbarComponent: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Tooltip content="Save" relationship="label">
        <Button
          appearance="subtle"
          icon={<SaveRegular className={styles.icon} />}
          onClick={() => console.log("Save information")}
        >
          Save
        </Button>
      </Tooltip>
      <Tooltip content="Reset" relationship="label">
        <Button
          appearance="subtle"
          icon={<ArrowClockwiseRegular className={styles.icon} />}
          onClick={() => console.log("Reset informartion")}
        >
          Reset
        </Button>
      </Tooltip>
    </div>
  );
};
export default ToolbarComponent;
