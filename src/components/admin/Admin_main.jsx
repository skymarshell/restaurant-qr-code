import React, { useState, createContext, useEffect } from "react";
import Admin_main_header from "./admin_main_components/Admin_main_header";
import Admin_main_sidebar from "./admin_main_components/Admin_main_sidebar";
import Admin_main_content from "./admin_main_components/Admin_main_content";
import { useNavigate } from "react-router-dom";

export const AdminContext = createContext();

function Admin_main() {


  const navigate = useNavigate();

  const [sideBarShow, setSideBarShow] = useState(false);

  function handleLogOut() {
    localStorage.removeItem("username");
    navigate("/Admin_login");
  }

  return (
    <AdminContext.Provider
      value={{ sideBarShow, setSideBarShow, handleLogOut }}>
      <div className="mx-auto min-h-dvh bg-blue-gray-100">
        <Admin_main_header />
        <div className="flex">
          <Admin_main_sidebar />
          <Admin_main_content />
        </div>
      </div>
    </AdminContext.Provider>
  );
}

export default Admin_main;
