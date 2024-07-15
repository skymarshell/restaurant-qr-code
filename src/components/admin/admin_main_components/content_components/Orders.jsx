import axios from "axios";
import React, { useEffect, useState, createContext } from "react";
import moment from "moment";
import Order_item from "./Orders_components/Order_item";
import Order_pagination from "./Orders_components/Order_pagination";

export const OrderContext = createContext("");

function Orders() {
  const [order, setOrder] = useState([]);
  const [orderLength, setOrderLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState("waiting orders");

  async function getOrder(page = 1) {
    try {
      const response = await axios.get(
        `http://localhost:3000/customer_order/get_order`,
        {
          params: { page, limit: 9, view: viewMode },
        }
      );
      const formattedOrders = response.data.orders.map((order) => ({
        ...order,
        order_date: moment(order.order_date)
          .add(543, "years")
          .format("DD-MM-YYYY HH:mm"),
      }));
      setOrder(formattedOrders);
      setOrderLength(response.data.totalOrders);
      setTotalPages(Math.ceil(response.data.totalOrders / 9));
    } catch (error) {
      console.log(
        "Error fetching orders:",
        error.response ? error.response.data : error.message
      );
    }
  }

  useEffect(() => {
    getOrder(currentPage);
  }, [currentPage, viewMode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      getOrder(currentPage);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentPage, viewMode]);

  const confirmOrder = async (orderId) => {
    try {
      await axios.post(`http://localhost:3000/customer_order/confirm_order`, {
        orderId,
      });
      getOrder(currentPage); // Refresh orders
    } catch (error) {
      console.error(
        "Error confirming order:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await axios.post(`http://localhost:3000/customer_order/cancel_order`, {
        orderId,
      });
      getOrder(currentPage); // Refresh orders
    } catch (error) {
      console.error(
        "Error cancelling order:",
        error.response ? error.response.data : error.message
      );
    }
  };

  function showOrder(order) {
    const orderSplit = order.split(",");
    return (
      <div>
        {orderSplit.map((o, index) => (
          <p key={index} className="ml-4 text-gray-700">
            - {o}
          </p>
        ))}
      </div>
    );
  }

  return (
    <>
      <OrderContext.Provider
        value={{
          order,
          currentPage,
          setCurrentPage,
          totalPages,
          orderLength,
          viewMode,
          setViewMode,
          confirmOrder,
          cancelOrder,
        }}>
        <Order_item showOrder={showOrder} />
        <Order_pagination />
      </OrderContext.Provider>
    </>
  );
}

export default Orders;
