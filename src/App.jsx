import React, { useState, createContext } from "react";

// components
import Header from "./components/header/Header";
import Menu from "./components/header/Menu";
import SummaryOrder from "./components/header/Summary_order";

const DataContext = createContext();

function App() {
  //all menu
  const [menus, SetMenus] = useState([]);
  //user order menu
  const [orders, setOrders] = useState([]);

  return (
    <div className="min-h-dvh w-full">
      <div className="mx-auto max-w-screen-xl px-4 py-2">
        <DataContext.Provider value={{ menus, SetMenus, orders, setOrders }}>
          <Header />
          <Menu />
          <SummaryOrder />
        </DataContext.Provider>
      </div>
    </div>
  );
}

export default App;
export { DataContext };
