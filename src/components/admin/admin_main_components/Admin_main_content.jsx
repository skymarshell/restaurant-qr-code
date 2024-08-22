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
      className="p-6 min-h-dvh w-full"
      onClick={() => setSideBarShow(false)}>
      <h1 className="text-2xl font-bold capitalize ">{currectPage}</h1>
      <p>
        This is the main content area. It should adjust based on the sidebar's
        visibility.
      </p>
      <article className=" border-4 border-white p-3 min-h-dvh">
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
