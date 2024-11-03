import React, { useContext } from "react";
import { OrderContext } from "../Orders";
import { useState } from 'react';

function showOrder(order) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const orderSplit = order.split(",");
  return (
    <div>
      <p className="ml-4 text-gray-700">- {orderSplit[0]}</p>
      {/*ใส่จำนนวน*/}
      {orderSplit.length > 1 && (
        <button
          onClick={() => setIsPopupOpen(true)}
          className="ml-4 text-black hover:underline"
        >
          ดูเพิ่มเติม
        </button>
      )}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-blue-100 to-pink-100 p-4 rounded-lg shadow-lg w-1/2 max-w-lg">
            <h2 className="text-xl font-bold mb-4">รายการอาหารท้้งหมด</h2>
            {orderSplit.map((o, index) => (
              <p key={index} className="text-gray-700">
                - {o}
              </p>
            ))}
            <button
              onClick={() => setIsPopupOpen(false)}
              className="mt-4 bg-red-500 hover:bg-red-900  py-2 px-4 rounded"
            >
              ปิด
            </button>
          </div>
        </div>
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
              <div className="text-gray-600 text-center">{o.order_date}</div>
              <div
                className={`text-sm px-2 py-1 rounded text-center ${
                  o.order_status == 2
                    ? "bg-yellow-100 text-orange-800 shadow-lg ml-5"
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
            <div className="w-full sm:text-center lg:flex lg:justify-between lg:items-center ">
              <div>
                <p className="text-center font-medium">
                  Table : <span className="text-2xl">{o.order_table}</span>
                </p>
              </div>
              <div
                className={`  flex justify-end gap-1 mb-3 lg:flex-row flex-col  ${
                  o.order_status == "2" ? "" : "hidden"
                }`}>
                <button
                  onClick={() => cancelOrder(o.order_id)}
                  className="btn btn-error shadow-lg ">
                  Cancel
                </button>
                <button
                  onClick={() => confirmOrder(o.order_id)}
                  className="btn btn-success shadow-lg">
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
