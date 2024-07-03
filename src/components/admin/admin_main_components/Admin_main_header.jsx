import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { AdminContext } from "../Admin_main";
function Admin_main_header() {
  const { sideBarShow, setSideBarShow } = useContext(AdminContext);

  const navigate = useNavigate();

  function handleLogOut() {
    localStorage.removeItem("username");
    navigate("/admin_login");
  }

  return (
    <header className="w-full bg-white p-3 shadow-md">
      <div className="container mx-auto flex flex-row-reverse lg:flex-row justify-between items-center">
        <h1 className="text-xl font-bold">
          Admin System {localStorage.getItem("username")}
        </h1>
        <button
          onClick={() => setSideBarShow(true)}
          className="text-blue-600 lg:hidden">
          <GiHamburgerMenu />
        </button>
      </div>
    </header>
  );
}

export default Admin_main_header;
