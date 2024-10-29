import React, { useContext } from "react";
import { OrderContext } from "../Orders";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function Order_pagination() {
  const { currentPage, setCurrentPage, totalPages, orderLength } =
    useContext(OrderContext);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Stack spacing={2} direction="row" justifyContent="center" mt={4}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        variant="outlined"
        shape="rounded"
        disabled={totalPages === 0 || orderLength === 0}
      />
    </Stack>
  );
}

export default Order_pagination;
