import { createBrowserRouter, RouterProvider } from "react-router-dom";
//pages
import App from "./App.jsx";
import Admin_login from "./components/admin/Admin_login.jsx";
import Admin_main from "./components/admin/Admin_main.jsx";
import Customer_main from "./components/customer/Customer_main.jsx";
import Login_check from "./components/admin/Login_check.jsx";
import Customer_protect from "./components/customer/Customer_protect.jsx";
import Print_QrCode from "./components/admin/admin_main_components/content_components/Tables_components/Print_QrCode.jsx";

const Routers = createBrowserRouter([
  //first page
  {
    path: "/",
    element: <App />,
  },
  //error not found path
  {
    path: "*",
    element: <div>Error page</div>,
  },
  // Admin Login
  {
    path: "/admin_login",
    element: <Admin_login />,
  },
  // Admin main
  {
    path: "/Admin_main",
    element: (
      <Login_check>
        <Admin_main />
      </Login_check>
    ),
  },
  // Customer menu
  {
    path: "/customer/:time/:id",
    element: (
      <Customer_protect>
        <Customer_main />
      </Customer_protect>
    ),
  },
  {
    path: "/Print_QrCode",
    element: <Print_QrCode />,
  },
]);

export default Routers;
