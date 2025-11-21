import type { TicketStatus } from "../types/interfaces/TicketItem";

export const statusColors: Record<TicketStatus, string> = {
  New: "blue",
  Open: "geekblue",
  "In Progress": "gold",
  Closed: "green",
  Cancel: "red",
};
