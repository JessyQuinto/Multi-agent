export interface Ticket {
  id: string;
  employeeId: string;
  employeeEmail: string;
  category: "Vacations" | "Payroll" | "Legal" | "Other" | "Compliance" | "RRHH";
  title: string;
  description: string;
  createdAt: string;
  state:
    | "NEW"
    | "CLASSIFIED"
    | "ASSIGNED"
    | "IN_REVIEW"
    | "RESOLVED"
    | "ESCALATED";
}
