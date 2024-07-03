import React, { useState, createContext } from "react";
import Admin_main_header from "./admin_main_components/Admin_main_header";
import loginCheck from "./loginCheck";
import Admin_main_sidebar from "./admin_main_components/Admin_main_sidebar";
import Admin_main_content from "./admin_main_components/Admin_main_content";

export const AdminContext = createContext();

function Admin_main() {
  loginCheck();
  const [sideBarShow, setSideBarShow] = useState(false);

  return (
    <AdminContext.Provider value={{ sideBarShow, setSideBarShow }}>
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
