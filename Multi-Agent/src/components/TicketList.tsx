import React from "react";
import {
  Card,
  CardHeader,
  Button,
  Dropdown,
  Option,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  createTableColumn,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
  tokens,
  Badge,
} from "@fluentui/react-components";
import type { TableColumnDefinition } from "@fluentui/react-components";
import {
  ArrowClockwiseRegular,
  FilterRegular,
  AddRegular,
  EyeRegular,
} from "@fluentui/react-icons";
import TicketComponent from "./TicketComponent";
import { fakeData } from "../data/tickets";
import { ticketStatusOptions } from "../constants/ticketStatusOptions";
import useTicketsList from "../hooks/useTicketsList";
import type { TicketItem } from "../types/interfaces/TicketItem";

const useStyles = makeStyles({
  card: {
    height: "100%",
    boxShadow: tokens.shadow4,
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    gap: "16px",
  },
  filters: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  dropdown: {
    minWidth: "180px",
  },
});

const columns: TableColumnDefinition<TicketItem>[] = [
  createTableColumn<TicketItem>({
    columnId: "id",
    compare: (a, b) => a.id.localeCompare(b.id),
    renderHeaderCell: () => "ID",
    renderCell: (item) => item.id,
  }),
  createTableColumn<TicketItem>({
    columnId: "category",
    compare: (a, b) => a.category.localeCompare(b.category),
    renderHeaderCell: () => "Category",
    renderCell: (item) => item.category,
  }),
  createTableColumn<TicketItem>({
    columnId: "title",
    compare: (a, b) => a.title.localeCompare(b.title),
    renderHeaderCell: () => "Title",
    renderCell: (item) => item.title,
  }),
  createTableColumn<TicketItem>({
    columnId: "createdAt",
    compare: (a, b) => a.createdAt.localeCompare(b.createdAt),
    renderHeaderCell: () => "Created At",
    renderCell: (item) => item.createdAt,
  }),
  createTableColumn<TicketItem>({
    columnId: "status",
    compare: (a, b) => a.status.localeCompare(b.status),
    renderHeaderCell: () => "Status",
    renderCell: (item) => {
      let color: "brand" | "danger" | "important" | "severe" | "success" | "warning" = "brand";
      if (item.status === "Open") color = "success";
      if (item.status === "In Progress") color = "warning";
      if (item.status === "Closed") color = "neutral" as any; // neutral not in strict type above but usually works or use default

      return <Badge appearance="filled" color={color}>{item.status}</Badge>;
    },
  }),
  createTableColumn<TicketItem>({
    columnId: "actions",
    renderHeaderCell: () => "",
    renderCell: () => (
      <Button icon={<EyeRegular />} appearance="subtle" />
    ),
  }),
];

const TicketsListComponent: React.FC = () => {
  const styles = useStyles();
  const {
    isModalOpen,
    selectedStatus,
    setSelectedStatus,
    handleFilter,
    handleClear,
    handleAddTicket,
    handleClose,
  } = useTicketsList();

  return (
    <Card className={styles.card}>
      <CardHeader header={<h2 style={{ margin: 0 }}>Tickets</h2>} />

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <Dropdown
            className={styles.dropdown}
            placeholder="Select status"
            value={selectedStatus || undefined}
            onOptionSelect={(_e, data) => setSelectedStatus(data.optionValue as any)}
          >
            {ticketStatusOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Dropdown>

          <Button icon={<FilterRegular />} appearance="primary" onClick={handleFilter}>
            Filter
          </Button>

          <Button icon={<ArrowClockwiseRegular />} onClick={handleClear}>
            Clear
          </Button>
        </div>

        <Button icon={<AddRegular />} appearance="primary" onClick={handleAddTicket}>
          Add Ticket
        </Button>
      </div>

      <DataGrid
        items={fakeData}
        columns={columns}
        sortable
        selectionMode="multiselect"
        getRowId={(item) => item.id}
      >
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<TicketItem>>
          {({ item, rowId }) => (
            <DataGridRow<TicketItem> key={rowId}>
              {({ renderCell }) => (
                <DataGridCell>{renderCell(item)}</DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>

      <Dialog open={isModalOpen} onOpenChange={(_e, data) => !data.open && handleClose()}>
        <DialogSurface style={{ maxWidth: "700px", width: "100%" }}>
          <DialogBody>
            <DialogTitle>Create Ticket</DialogTitle>
            <DialogContent>
              <TicketComponent />
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={handleClose}>Close</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </Card>
  );
};

export default TicketsListComponent;
