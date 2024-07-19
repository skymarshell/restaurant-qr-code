import React, { useState } from "react";
import QRCode from "react-qr-code";

function Table_show({ tables }) {
  if (!tables.length) {
    return <p>No tables available</p>;
  }

  const qrCodeBase = `http://localhost:5173/customer/1/`;

  function getDateTime() {
    // Get the current date
    //YYYY-MM-DD HH-MM-S
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return currentTime;
  }

  function endTime(start_time) {
    const maxTime = 150;
    const splitStartTime = start_time.split(":");
    const startTimeHour = splitStartTime[0];
    const startTimeMinute = splitStartTime[1];
    //2
    let endTimeHour = Math.floor(maxTime / 60) + parseInt(startTimeHour);
    //30
    let endTimeMinute = (maxTime % 60) + parseInt(startTimeMinute);
    if (endTimeMinute >= 60) {
      endTimeHour += 1;
      endTimeMinute %= 60;
    }
    if (endTimeMinute < 10) {
      endTimeMinute = 0 + String(endTimeMinute);
    }
    const endTime = `${endTimeHour}:${endTimeMinute}`;
    return endTime;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
      {tables.map((table, index) => (
        <div key={index} className="border border-white p-4">
          <div className="flex justify-between">
            <p>Table number: {table.table_number}</p>
            <p
              className={`px-3 rounded-lg ${
                table.status == 1 ? "bg-green-600" : "bg-red-300"
              }`}>
              Status: {table.status == 1 ? "Avalible" : "Unavailable"}
            </p>
          </div>
          <div>
            <p>Start time: {table.start_time}</p>
            <p>Remaining time: {endTime(table.start_time)}</p>
          </div>

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
          <div>
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={``}
              viewBox={`0 0 256 256`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Table_show;
