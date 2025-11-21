import type { TicketItem } from "../types/interfaces/TicketItem";

export const fakeData: TicketItem[] = [
  {
    id: "7bd2e2",
    category: "Payroll",
    title: "Request for payroll adjustment",
    createdAt: "2022-11-21T19:34:58.908Z",
    status: "New",
  },
  {
    id: "7bd2c8",
    category: "Vacation",
    title: "Request to modify vacation dates",
    createdAt: "2022-11-21T19:34:58.908Z",
    status: "In Progress",
  },
  {
    id: "7bd2df",
    category: "Payroll",
    title: "Missing overtime payment",
    createdAt: "2022-11-21T19:34:58.908Z",
    status: "Open",
  },
  {
    id: "7bd2c0",
    category: "Employee Records",
    title: "Incorrect personal information in the system",
    createdAt: "2022-11-21T19:34:58.908Z",
    status: "Closed",
  },
];
