import React from "react";
import { Navigate } from "react-router-dom";

function Login_check({ children }) {
  const isAuthenticated = localStorage.getItem("username");

  if (!isAuthenticated) {
    return <Navigate to="/admin_login" />;
  }

  return children;
}

export default Login_check;
