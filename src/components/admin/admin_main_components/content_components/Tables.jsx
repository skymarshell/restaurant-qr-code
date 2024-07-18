import React, { useEffect, useState } from "react";
import Table_show from "./Tables_components/Table_show";
import axios from "axios";

function Tables() {
  const [tables, setTables] = useState([]);
  const [isEdit, setIsEdit] = useState(false); // State to track editing status

  async function getTable() {
    try {
      const response = await axios.get("http://localhost:3000/tables/table");
      setTables(response.data);
      console.log(tables);
    } catch (error) {
      console.error("Error fetching tables:", error);
      alert("Error fetching tables. Please try again later.");
    }
  }

  useEffect(() => {
    // Fetch data initially
    getTable();

    // Interval to fetch data every 10 seconds if not in edit mode
    const interval = setInterval(() => {
      if (!isEdit) {
        getTable();
      }
    }, 10000); // 10000 milliseconds = 10 seconds

    // Clean up interval on component unmount or re-render
    return () => {
      clearInterval(interval);
    };
  }, [isEdit]); // Dependency on isEdit to start/stop interval based on edit mode

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <p>Tables</p>
      {/* Pass tables and setIsEdit as props to Table_show */}
      <Table_show tables={tables} setIsEdit={setIsEdit} />
    </div>
  );
}

export default Tables;
