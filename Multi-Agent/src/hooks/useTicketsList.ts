import { useState } from "react";

const useTicketsList = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilter = () => {
    console.log("Filter By:", selectedStatus);
  };

  const handleClear = () => {
    setSelectedStatus(null);
    console.log("Filters cleared");
  };

  const handleAddTicket = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return{isModalOpen, selectedStatus, setSelectedStatus, handleFilter, handleClear, handleAddTicket, handleClose};
};
export default useTicketsList;
