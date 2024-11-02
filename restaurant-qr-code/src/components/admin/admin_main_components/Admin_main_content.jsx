import React, { useContext } from "react";
import { AdminContext } from "../Admin_main";
//content_components
import Categories from "./content_components/Categories";
import Foods from "./content_components/Foods";
import Customer_main from "../../customer/Customer_main";
import Orders from "./content_components/Orders";
import Tables from "./content_components/Tables";
import Dashboard from "./content_components/Dashboard";

function Admin_main_content() {
  const {
    sideBarShow,
    setSideBarShow,
    handleLogOut,
    currectPage,
    setCurrectPage,
  } = useContext(AdminContext);

  return (
    <main
      className="pl-5 pt-10 min-h-dvh w-full bg-gradient-to-r from-blue-100 to-pink-100"
      onClick={() => setSideBarShow(false)}>
      <h1 className="text-2xl font-bold capitalize ">{currectPage}</h1>
      <article className="pr-3 min-h-dvh">
        {currectPage == "Categories" && <Categories />}
        {currectPage == "Foods" && <Foods />}
        {currectPage == "Customer view" && <Customer_main isAdmin={true} />}
        {currectPage == "Orders" && <Orders />}
        {currectPage == "Tables" && <Tables />}
        {currectPage == "Dashboard" && <Dashboard />}
      </article>
    </main>
  );
}

export default Admin_main_content;
