import React, { useState, createContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// components
Header;
import Header from "./Customer_main_components/Header";
import Menu from "./Customer_main_components/Menu";
import Summary_order from "./Customer_main_components/Summary_order";

export const DataContext = createContext();

function Customer_main({ isAdmin }) {
  //all menu
  const [menus, setMenus] = useState([]);
  //all category
  const [categories, setCategories] = useState([]);
  //user order menu
  const [orders, setOrders] = useState([]);
  //custoer day,id
  const { time, id } = useParams();
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
          }}>
          <Header />
          <Menu />
          <Summary_order />
        </DataContext.Provider>
      </div>
    </div>
  );
}

export default Customer_main;
