import React, { useContext } from "react";
import { OrderContext } from "../Orders";

function Order_item({ showOrder }) {
  const {
    order,
    orderLength,
    viewMode,
    setViewMode,
    confirmOrder,
    cancelOrder,
  } = useContext(OrderContext);

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 ">
        {viewMode === "waiting orders"
          ? `Waiting orders: ${orderLength} orders`
          : `Total orders: ${orderLength} orders `}
      </h1>
      <div className="flex gap-3 mb-5">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 ">
        {order.map((o, index) => (
          <div
            className="border-2 border-gray-300 rounded-lg p-4 shadow-lg"
            key={index}>
            <div
              className={`w-full flex justify-end gap-1 mb-3 lg:flex-row flex-col  ${
                o.order_status == "2" ? "" : "hidden"
              }`}>
              <button
                onClick={() => cancelOrder(o.order_id)}
                className="btn btn-error">
                Cancel order
              </button>
              <button
                onClick={() => confirmOrder(o.order_id)}
                className="btn btn-success">
                Confirm
              </button>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-800 font-semibold text-center">
                Order ID: {o.order_id}
              </div>
              <div className="text-gray-600 text-center">{o.order_date}</div>
              <div
                className={`text-sm px-2 py-1 rounded text-center ${
                  o.order_status == 2
                    ? "bg-yellow-100 text-yellow-800"
                    : o.order_status == 1
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                {o.order_status == 2
                  ? "Waiting"
                  : o.order_status == 1
                  ? "Order completed"
                  : "Order canceled"}
              </div>
            </div>
            <div className="border-t border-gray-200 mt-2 pt-2">
              {showOrder(o.orders)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Order_item;
