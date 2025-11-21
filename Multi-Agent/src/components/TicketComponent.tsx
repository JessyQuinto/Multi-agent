import React, { useState } from "react";
import {
  makeStyles,
  Input,
  Label,
  Textarea,
  Dropdown,
  Option,
  Button,
  tokens,
  Card,
  CardHeader,
} from "@fluentui/react-components";
import type { SelectionEvents, OptionOnSelectData } from "@fluentui/react-components";
import ToolbarComponent from "./ToolbarComponent";
import useTicket from "../hooks/useTicket";
import { categories } from "../constants/categories";

const useStyles = makeStyles({
  card: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    boxShadow: tokens.shadow16,
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  row: {
    display: "flex",
    gap: "16px",
  },
  col: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "4px",
  },
  submitBtn: {
    marginTop: "16px",
    alignSelf: "flex-end",
  },
});

const TicketComponent: React.FC = () => {
  const styles = useStyles();
  const { handleFinish } = useTicket();

  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const onCategoryChange = (_event: SelectionEvents, data: OptionOnSelectData) => {
    setCategory(data.optionValue || "");
  };

  const handleSubmit = () => {
    handleFinish({
      category,
      createdAt: date, // Note: Type mismatch might occur if interface expects Date object, but for now string is fine or we parse it
      title,
      description,
    });
  };

  return (
    <>
      <ToolbarComponent />
      <Card className={styles.card}>
        <CardHeader header={<h2 style={{ margin: 0 }}>Create Ticket</h2>} />
        <div className={styles.form}>
          <div className={styles.row}>
            <div className={styles.col}>
              <Label required>Category</Label>
              <Dropdown
                placeholder="Select a category"
                onOptionSelect={onCategoryChange}
                value={category}
              >
                {categories.map((c) => (
                  <Option key={c} value={c}>
                    {c}
                  </Option>
                ))}
              </Dropdown>
            </div>

            <div className={styles.col}>
              <Label required>Date</Label>
              <Input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.col}>
            <Label required>Title</Label>
            <Input
              placeholder="Short title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.col}>
            <Label required>Description</Label>
            <Textarea
              placeholder="Detailed description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button appearance="primary" className={styles.submitBtn} onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Card>
    </>
  );
};

export default TicketComponent;
