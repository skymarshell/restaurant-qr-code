import React, { useContext, useState } from "react";
import { OrderContext } from "../Orders";
function Order_select() {
  // ทำเลือกวัน
  const [viewOrdersType, setViewOrdersType] = useState("1");

  const {
    order,
    orderLength,
    viewMode,
    setViewMode,
    confirmOrder,
    cancelOrder,
  } = useContext(OrderContext);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-gray-800 ">
        {viewMode === "waiting orders"
          ? `Waiting orders: ${orderLength} orders`
          : `Total orders: ${orderLength} orders `}
      </h1>
      <div className="flex gap-3 mb-5 flex-col md:flex-row">
        <button
          onClick={() => setViewMode("view all orders")}
          className="btn btn-info">
          View all orders
        </button>
        <button
          onClick={() => setViewMode("waiting orders")}
          className="btn btn-warning">
          View waiting orders
        </button>
      </div>
      <select onChange={(e) => setViewOrdersType(e.target.value)}>
        <option value="1">View orders this day.</option>
        <option value="2">View orders by date.</option>
      </select>
      {viewOrdersType == 2 && <div>123</div>}
    </div>
  );
}

export default Order_select;
