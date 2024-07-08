import React, { useContext } from "react";
import { AdminContext } from "../Admin_main";
//content_components
import Categories from "./content_components/Categories";

function Admin_main_content() {
  const {
    sideBarShow,
    setSideBarShow,
    handleLogOut,
    currectPage,
    setCurrectPage,
  } = useContext(AdminContext);

  return (
    <div className="p-6 min-h-dvh w-full" onClick={() => setSideBarShow(false)}>
      <h1 className="text-2xl font-bold">Admin Main Content</h1>
      <p>
        This is the main content area. It should adjust based on the sidebar's
        visibility.
      </p>
      <main className="border-4 border-white p-2">
        {currectPage == "Categories" && <Categories />}
      </main>
    </div>
  );
}

export default Admin_main_content;
