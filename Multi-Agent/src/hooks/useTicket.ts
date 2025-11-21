import type { Ticket } from "../types/interfaces/ticket.interface";

const useTicket = () => {
  const handleFinish = (values: Partial<Ticket>) => {
    const ticket = {
      ...values,
      createdAt: values.createdAt,
    };
    console.log("Saved:", ticket);
  };

  return { handleFinish };
};
export default useTicket;
