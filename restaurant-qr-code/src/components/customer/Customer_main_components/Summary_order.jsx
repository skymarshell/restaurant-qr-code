import React, { useContext, useState } from "react";
import { DataContext } from "../Customer_main";
import axios from "axios";

function Summary_order() {
  // info
  const { id, orders, setOrders, isAdmin, alert, setAlert } =
    useContext(DataContext);
  // set pop-up summary order
  const [popUp, setPopUp] = useState(false);

  async function handleConfrim() {
    console.log(orders);
    setPopUp(false);
    setOrders([]);
    setAlert(true);
    //send to backend
    try {
      if (orders.length <= 0) {
        return;
      }

      const send = await axios.post(
        "http://localhost:3000/customer_order/send_order",
        {
          id,
          orders,
        }
      );
    } catch (error) {
      alert("Cant send order ", error);
    }
  }

  return (
    <>
      {/* footer */}
      <aside
        className={`w-full fixed bottom-0 right-0 z-10 text-center bg-blue-500 hover:bg-blue-800 ${
          isAdmin == true ? "hidden" : " "
        } ${orders.length <= 0 ? "hidden" : "block"}`}>
        <button
          onClick={() => setPopUp(true)}
          disabled={orders.length <= 0}
          className="w-full">
          Confirm order
        </button>
      </aside>
      {/* pop-up */}
      {popUp && (
        <div className="z-20 fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded shadow-lg max-w-[500px] max-h-[300px] overflow-auto">
            <div className="flex gap-6 justify-between font-bold">
              <p className="w-8/12">Name</p>
              <p>Quantity</p>
            </div>
            {orders.map((order, index) => (
              <div key={index} className=" flex gap-6 justify-between">
                <p className="w-8/12 overflow-auto">{order.name}</p>
                <p>{order.quantity}</p>
              </div>
            ))}
            <div className="flex gap-8 mt-3">
              <button onClick={() => setPopUp(false)} className="mt-4">
                Return
              </button>
              <button onClick={handleConfrim} className="mt-4">
                Confrim
              </button>
            </div>
          </div>
        </div>
      )}
      {/* alert */}

      <br />
    </>
  );
}

export default Summary_order;
