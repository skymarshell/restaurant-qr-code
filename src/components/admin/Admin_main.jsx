import React, { useEffect } from "react";
import Admin_main_header from "./admin_main_components/Admin_main_header";
import loginCheck from "./loginCheck";

function Admin_main() {
  loginCheck();

  return (
    <div className="max-w-screen-xl mx-auto min-h-dvh bg-blue-gray-100">
      <Admin_main_header />
    </div>
  );
}
// Dashboard
// Menu Management
// Orders
// Customers
// Settings

export default Admin_main;
