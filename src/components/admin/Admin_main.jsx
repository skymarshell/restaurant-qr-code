import React, { useEffect } from "react";
import Admin_main_header from "./admin_main_components/Admin_main_header";
import loginCheck from "./loginCheck";
import  Admin_main_sidebar from "./admin_main_components/Admin_main_sidebar";

function Admin_main() {
  loginCheck();

  return (
    <div className="mx-auto min-h-dvh bg-blue-gray-100">
      {/* <Admin_main_header /> */}
      <Admin_main_sidebar />
    </div>
  );
}
// Dashboard
// Menu Management
// Orders
// Customers
// Settings

export default Admin_main;
