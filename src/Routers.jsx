import { createBrowserRouter, RouterProvider } from "react-router-dom";
//pages
import App from "./App.jsx";
import Admin from "./components/admin/Admin.jsx";

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
    path: "/admin",
    element: <Admin />,
  },
]);

export default Routers;
