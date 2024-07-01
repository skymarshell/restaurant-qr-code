import { createBrowserRouter, RouterProvider } from "react-router-dom";
//pages
import App from "./App.jsx";
import Admin_login from "./components/admin/Admin_login.jsx";
import Admin_main from "./components/admin/Admin_main.jsx";

const Routers = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    //error not found path
    path: "*",
    element: <div>Error page</div>,
  },
  {
    path: "/admin_login",
    element: <Admin_login />,
  },
  {
    path: "/Admin_main",
    element: <Admin_main />,
  },
]);

export default Routers;
