import React, { useState, createContext, useEffect } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// components
import Header from "./Customer_main_components/Header";
import Menu from "./Customer_main_components/Menu";
import Summary_order from "./Customer_main_components/Summary_order";
import Alert from "./Customer_main_components/Alert";
import Orders_history from "./Customer_main_components/Orders_history";
export const DataContext = createContext();

function Customer_main({ isAdmin }) {
  const navigate = useNavigate();
  //all menu
  const [menus, setMenus] = useState([]);
  //all category
  const [categories, setCategories] = useState([]);
  //user order menu
  const [orders, setOrders] = useState([]);
  //custoer day,id
  const { time, id } = useParams();
  //alert
  const [alert, setAlert] = useState(false);
  //view orders history ?
  const [viewOrdersHistory, setViewOrdersHistory] = useState(false);
  //เช็คว่าโต๊ะ status available or unavailable
  const checkStatus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/tables/table/${time}/${id}`
      );
      console.log(res.data);

      if (res.data != 1) {
        if (isAdmin != true) {
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
      window.alert(error);
    }
  };

  //get menu
  async function getMenus() {
    try {
      const res = await axios.get("http://localhost:3000/food/menu");
      setMenus(res.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  }
  //get category
  async function getCategories() {
    try {
      const res = await axios.get("http://localhost:3000/category/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    getMenus();
    getCategories();

    const status = setInterval(checkStatus, 1000);

    return () => clearInterval(status);
  }, []);

  return (
    <div className="min-h-dvh w-full">
      <div className="mx-auto max-w-screen-xl px-4 py-2 bg-white">
        <DataContext.Provider
          value={{
            menus,
            setMenus,
            categories,
            orders,
            setOrders,
            id,
            time,
            isAdmin,
            alert,
            setAlert,
            viewOrdersHistory,
            setViewOrdersHistory,
          }}>
          <Header />
          <Menu />
          <Summary_order />
          <Alert />
          {viewOrdersHistory == true && <Orders_history />}
        </DataContext.Provider>
      </div>
    </div>
  );
}

export default Customer_main;
