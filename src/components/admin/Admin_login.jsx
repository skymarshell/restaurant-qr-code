import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin_login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { username, password };

    try {
      const response = await axios.post(
        "http://localhost:3000/admin/login",
        data
      );

      if (response.status === 200) {
        localStorage.setItem("username", username);
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

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-bold mb-2">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-3 py-2 border rounded w-full"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 border rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Admin_login;
