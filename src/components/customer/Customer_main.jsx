import React, { useState, createContext } from "react";
import { useParams } from "react-router-dom";
// components
Header;
import Header from "./Customer_main_components/Header";
import Menu from "./Customer_main_components/Menu";
import Summary_order from "./Customer_main_components/Summary_order";

export const DataContext = createContext();

function Customer_main({ isAdmin }) {
  //all menu
  const [menus, SetMenus] = useState([]);
  //user order menu
  const [orders, setOrders] = useState([]);
  //custoer day,id
  const { time, id } = useParams();

  return (
    <div className="min-h-dvh w-full">
      <div className="mx-auto max-w-screen-xl px-4 py-2">
        <DataContext.Provider
          value={{ menus, SetMenus, orders, setOrders, id, time, isAdmin }}>
          <Header />
          <Menu />
          <Summary_order />
        </DataContext.Provider>
      </div>
    </div>
  );
}

export default Customer_main;
