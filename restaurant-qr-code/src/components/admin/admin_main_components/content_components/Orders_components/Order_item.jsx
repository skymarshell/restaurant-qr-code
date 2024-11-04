import React, { useContext } from "react";
import { OrderContext } from "../Orders";

function showOrder(order) {
  const orderSplit = order.split(",");
  return (
    <div>
      {orderSplit.length == 1 && (
        <p className="ml-4 text-gray-700">- {orderSplit[0]}</p>
      )}
      {orderSplit.length > 1 && (
        <details className="ml-4 text-black ">
          <summary className="hover:underline">ดูเพิ่มเติม</summary>
          <div className="bg-gradient-to-r from-blue-100 to-pink-100 p-4 rounded-lg shadow-lg mt-2">
            <h2 className="text-xl font-bold mb-4">รายการอาหารทั้งหมด</h2>
            {orderSplit.map((o, index) => (
              <p key={index} className="text-gray-700">
                - {o}
              </p>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function Order_item() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-10 ">
        {order.map((o, index) => (
          <div
            className="bg-gradient-to-r from-amber-100 to-blue-100 rounded-lg p-4 shadow-lg"
            key={index}>
            <div className="flex justify-between items-center mb-2">
              <div className="text-black font-semibold text-center">
                Order ID : {o.order_id}
              </div>
              <div className="text-gray-600 text-center ml-5">{o.order_date}</div>
              <div
                className={`text-sm px-2 py-1 rounded text-center ${
                  o.order_status == 2
                    ? "bg-yellow-100 shadow-lg text-orange-800"
                    : o.order_status == 1
                    ? "bg-green-100 text-green-800 shadow-lg"
                    : "bg-red-100 text-red-800 shadow-lg"
                }`}>
                {o.order_status == 2
                  ? "Waiting"
                  : o.order_status == 1
                  ? "Order completed"
                  : "Order canceled"}
              </div>
            </div>
            <div className="w-full sm:text-center lg:justify-between lg:items-center ">
              <div>
                <p className="ml-3 text-left font-bold text-lg">
                  Table : <span className="">{o.order_table}</span>
                </p>
              </div>
              <div
                className={`flex py-2 ${
                  o.order_status == "2" ? "" : "hidden"
                }`}>
                <button
                  onClick={() => cancelOrder(o.order_id)}
                  className="btn bg-red-500 ml-16 hover:bg-red-900">
                  Cancel
                </button>
                <button
                  onClick={() => confirmOrder(o.order_id)}
                  className="btn bg-green-700 ml-5 hover:bg-green-900">
                  Confirm
                </button>
              </div>
            </div>

            <div className="border-t border-gray-500 mt-2 pt-2">
              {showOrder(o.orders)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Order_item;
