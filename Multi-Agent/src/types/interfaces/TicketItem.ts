export type TicketStatus = "New" | "Open" | "In Progress" | "Closed" | "Cancel";

export interface TicketItem {
  id: string;
  category: string;
  title: string;
  createdAt: string;
  status: TicketStatus;
}