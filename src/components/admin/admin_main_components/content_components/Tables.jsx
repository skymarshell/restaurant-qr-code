import React, { useEffect, useState } from "react";
import Table_item from "./Tables_components/Table_item";
import axios from "axios";

function Tables() {
  const [tables, setTables] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  async function getTable() {
    try {
      const response = await axios.get("http://localhost:3000/tables/table");
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
      if (!isEdit) {
        getTable();
      }
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [isEdit]);

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <p>Tables</p>
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        {tables.map((table) => (
          <Table_item
            key={table.table_number}
            table={table}
            setIsEdit={setIsEdit}
            getTable={getTable}
          />
        ))}
      </div>
    </div>
  );
}

export default Tables;
