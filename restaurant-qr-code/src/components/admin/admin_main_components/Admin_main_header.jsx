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
    <header className="w-full bg-gradient-to-r from-green-200 via-blue-200 to-pink-200 p-3 shadow-md sticky top-0 z-20">
      <div className="flex justify-between items-center pl-0 pr-4">
        <div className="flex items-center">
          <img src="https://static.vecteezy.com/system/resources/thumbnails/008/513/899/small_2x/blue-diamond-illustration-png.png" alt="DiamondBu Logo" className="w-8 h-8 mr-2" />
          <span className="text-base md:text-lg lg:text-xl font-bold italic">DiamondBu</span>
        </div>
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold italic absolute left-1/2 transform -translate-x-1/2">Dashboard</h1>
        <button
          onClick={() => setSideBarShow(!sideBarShow)}
          className="text-blue-600 lg:hidden"
        >
          <GiHamburgerMenu />
        </button>
      </div>
    </header>
  );
}

export default Admin_main_header;
