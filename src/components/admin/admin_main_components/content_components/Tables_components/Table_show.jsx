import React, { useState } from "react";

function Table_show({ tables }) {
  if (!tables.length) {
    return <p>No tables available</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
      {tables.map((table) => (
        <div key={table.id} className="border border-white p-4">
          <p>Table number: {table.table_number}</p>
          <p>Status: {table.status}</p>
          <p>Start time: {table.start_time}</p>
          <p>Remaining time: {table.remainingTime}</p>
          <p>Number of customers: {table.customer_count}</p>
          <div>
            <button className="text-red-500">Delete</button>
            <button className="text-blue-500">Edit</button>
          </div>
          <div>
            <button className="text-green-500">End</button>
            <button className="text-purple-500">View QR code</button>
            <button className="text-orange-500">Print</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Table_show;
