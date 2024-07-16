import React, { useContext } from "react";
import { OrderContext } from "../Orders";

function Order_search({ setOrderFilter, setIsSearch, setSearchId, searchId }) {
  const { order } = useContext(OrderContext);

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchId(searchValue);
    if (searchValue === "") {
      setIsSearch(false);
      setOrderFilter(order); // Reset filter to all orders if search is empty
    } else {
      setIsSearch(true);
      setOrderFilter(
        order.filter((o) => o.order_id.toString().includes(searchValue))
      );
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <input
        type="text"
        placeholder="Search by order ID"
        onChange={handleSearch}
        className="border p-2 w-full"
        value={searchId}
        id="search_id"
      />
    </div>
  );
}

export default Order_search;
