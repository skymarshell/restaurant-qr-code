import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../Customer_main";
import { useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns"; // Import date-fns for formatting

function Orders_history() {
  const { viewOrdersHistory, setViewOrdersHistory, isAdmin } =
    useContext(DataContext);
  const { time, id } = useParams();
  const [OrderHistory, setOrderHistory] = useState([]);
  const [error, setError] = useState(null);
  const [getPage, setGetPage] = useState(0);

  const orderStatusMessages = {
    2: "Waiting for delivery",
    1: "Order successfully",
    "-1": "Order canceled",
  };

  // Prevent click events inside the modal from closing the modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  async function getOrdersHistory() {
    try {
      let response;
      if (isAdmin) {
        response = await axios.get(
          `http://localhost:3000/customer_order/orders_history/admin/admin`,
          { params: { getPage } }
        );
        const data = response.data;
        if (getPage == 0) {
          setOrderHistory((old) => [...data]);
        } else {
          setOrderHistory((old) => [...old, ...data]);
        }
      } else {
        response = await axios.get(
          `http://localhost:3000/customer_order/orders_history/${time}/${id}`
        );
        const data = response.data;
        setOrderHistory(data);
      }
    } catch (err) {
      setError("Failed to fetch order history");
      console.error(err);
    }
  }

  useEffect(() => {
    getOrdersHistory();
  }, [time, id, getPage]); // Re-fetch data if time or id changes

  // Function to format the date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = format(date, "d");
    const month = format(date, "M");
    const year = parseInt(format(date, "yyyy")) + 543; // Adding 543 to the year
    const hours = format(date, "H").padStart(2, "0");
    const minutes = format(date, "m").padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  return (
    <div
      onClick={() => setViewOrdersHistory(false)} // Close modal when clicking outside
      className="z-30 fixed top-0 right-0 bottom-0 left-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div
        onClick={handleModalClick} // Prevent closing modal when clicking inside
        className="w-3/4 h-3/4 max-w-[800px] bg-blue-gray-50 p-4 rounded-lg shadow-lg overflow-auto">
        <div className="flex justify-between">
          <div className="text-xl font-semibold">Orders History</div>
          <button
            onClick={() => setViewOrdersHistory(false)}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Close">
            X
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}{" "}
        {/* Display error if any */}
        {/* Display order history */}
        <div className="mt-4 ">
          {OrderHistory.length > 0 ? (
            <ul>
              {OrderHistory.map((order) => (
                <li
                  key={order.order_id}
                  className="p-2 bg-gray-100 rounded-lg shadow-gray-400  shadow-inner mt-4">
                  <p>
                    <strong>Order ID:</strong> {order.order_id}
                  </p>
                  <p>
                    <strong>Orders:</strong> {order.orders}
                  </p>
                  <p>
                    <strong>Order Date:</strong> {formatDate(order.order_date)}
                  </p>
                  <p>
                    <strong>Table:</strong> {order.order_table}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span>
                      {orderStatusMessages[order.order_status] ||
                        "Unknown status"}
                    </span>
                  </p>
                </li>
              ))}
              {isAdmin && (
                <button
                  className="btn btn-square"
                  onClick={() => setGetPage(getPage + 1)}>
                  ดูเพิ่ม
                </button>
              )}
            </ul>
          ) : (
            <p>No orders found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders_history;
