import React, { useState, Suspense, lazy, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "./AdminLogin.css";
import { backend_api } from "../../../backend_api";

function Admin_login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { username, password };

    try {
      const response = await axios.post(`${backend_api}/admin/login`, data);

      if (response.status === 200) {
        sessionStorage.setItem("username", username);
        navigate("/Admin_main");
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      if (error.response.status === 404) {
        alert("Admin not found");
      } else {
        console.error("Error:", error.response.data);
      }
    }
  };

  useEffect(() => {
    alert("โปรดใช้รหัสดังนี้\nUsername: admin\nPassword: 123");
  }, []);

  return (
    <div className="admin-login-container">
      <div className="login-box">
        <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="label">
              Username:
            </label>
            <div className="input-container">
              <FaUser className="icon" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="label">
              Password:
            </label>
            <div className="input-container">
              <FaLock className="icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Admin_login;
