import React, { useState } from "react";
import QRCode from "react-qr-code";

function Table_show({ tables }) {
  if (!tables.length) {
    return <p>No tables available</p>;
  }
  const maxTime = 150;
  const qrCodeBase = `http://localhost:5173/customer`;

  function endTime(start_time) {
    const splitStartTime = start_time.split(":");
    const startTimeHour = splitStartTime[0];
    const startTimeMinute = splitStartTime[1];
    //2
    let endTimeHour = Math.floor(maxTime / 60) + parseInt(startTimeHour);
    //30
    let endTimeMinute = (maxTime % 60) + parseInt(startTimeMinute);
    if (endTimeHour >= 24) {
      endTimeHour -= 24;
    }
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

  function remaining_time(start_time, end_time) {
    function getDateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    function timeToMinutes(time) {
      const [hour, minute] = time.split(":").map(Number);
      return hour * 60 + minute;
    }

    // Get current time and convert to minutes
    const currentTime = getDateTime();
    const currentTimeMinutes = timeToMinutes(currentTime);

    // Convert start and end times to minutes
    const startTimeMinutes = timeToMinutes(start_time);
    let endTimeMinutes = timeToMinutes(end_time);

    // Handle end time rollover to the next day
    if (startTimeMinutes > endTimeMinutes) {
      endTimeMinutes += 24 * 60; // Add 24 hours in minutes
    }

    let remainingMinutes = endTimeMinutes - currentTimeMinutes;

    // If the remaining minutes are negative, it means the time is up
    if (remainingMinutes < 0) {
      return "Time's up.";
    }

    // Convert remaining minutes back to hours and minutes
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingMinutesPart = remainingMinutes % 60;

    // Format the result as HH:MM
    return `${remainingHours}:${
      remainingMinutesPart < 10 ? "0" : ""
    }${remainingMinutesPart} hours.`;
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
            <div>
              <p>End time: {endTime(table.start_time)}</p>
              <p>
                Remaining time :{" "}
                {remaining_time(table.start_time, endTime(table.start_time))}{" "}
              </p>
            </div>
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
              value={`${qrCodeBase}/${table.start_time}/${table.table_number}`}
              viewBox={`0 0 256 256`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Table_show;
