import React, { useContext, useState } from "react";
import { DataContext } from "../../App";

function SummaryOrder() {
  const { menus, SetMenus, orders, setOrders } = useContext(DataContext);
  const [popUp, setPopUp] = useState(false);
  const [alert, setAlert] = useState(false)
  function handleConfrim() {
    setPopUp(false);
    setOrders([]);
    //send to backend
  }

  return (
    <>
      <aside className="w-full fixed bottom-0 right-0 z-10 text-center bg-blue-500 hover:bg-blue-800">
        <button onClick={() => setPopUp(true)}>Confirm order</button>
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
                <p className="w-8/12 overflow-auto">{order.id}</p>
                <p>{order.quantity}</p>
              </div>
            ))}
            <div className="flex gap-8 mt-3">
              <button onClick={() => setPopUp(false)} className="mt-4">
                Close
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

export default SummaryOrder;
