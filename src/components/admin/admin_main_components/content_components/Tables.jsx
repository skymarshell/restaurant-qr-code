import React, { useEffect, useState } from "react";
import Table_add from "./Tables_components/Table_add";
import Table_item from "./Tables_components/Table_item";
import axios from "axios";

function Tables() {
  const [tables, setTables] = useState([]);
  const tableUrl = "http://localhost:3000/tables";
  async function getTable() {
    try {
      const response = await axios.get(`${tableUrl}/table`);
      setTables(response.data);
      console.log(response.data); // Updated to log the response data
    } catch (error) {
      console.error("Error fetching tables:", error);
      alert("Error fetching tables. Please try again later.");
    }
  }

  useEffect(() => {
    getTable();

    const interval = setInterval(() => {
      getTable();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto p-6">

        <Table_add />

      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        {tables.map((table) => (
          <Table_item
            key={table.table_number}
            table={table}
            getTable={getTable}
            tableUrl={tableUrl}
          />
        ))}
      </div>
    </div>
  );
}

export default Tables;
