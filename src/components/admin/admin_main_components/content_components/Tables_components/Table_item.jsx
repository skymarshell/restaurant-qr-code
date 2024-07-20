import React, { useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";

function Table_item({ table, setIsEdit, getTable }) {
  const maxTime = 150; // Maximum time in minutes
  const qrCodeBase = `http://localhost:5173/customer`; // Base URL for QR code
  const [available, setAvailable] = useState(table.status);
  function endTime(start_time) {
    if (start_time == "-") {
      return "-";
    }

    const [startTimeHour, startTimeMinute] = start_time.split(":").map(Number);

    let endTimeHour = Math.floor(maxTime / 60) + startTimeHour;
    let endTimeMinute = (maxTime % 60) + startTimeMinute;

    if (endTimeMinute >= 60) {
      endTimeHour += 1;
      endTimeMinute %= 60;
    }

    if (endTimeHour >= 24) {
      endTimeHour -= 24;
    }

    return `${String(endTimeHour).padStart(2, "0")}:${String(
      endTimeMinute
    ).padStart(2, "0")}`;
  }

  function remaining_time(start_time, end_time) {
    if (start_time == "-") {
      return "-";
    }

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

    if (startTimeMinutes > currentTimeMinutes) {
      return `${Math.floor(maxTime / 60)}:${maxTime % 60} hours`;
    }

    // Format the result as HH:MM
    return `${remainingHours}:${
      remainingMinutesPart < 10 ? "0" : ""
    }${remainingMinutesPart} hours.`;
  }

  return (
    <div className="border border-white p-4">
      {/* table,status */}
      <div className="flex flex-col lg:flex-row justify-between border-b-2 border-black pb-3">
        <p className="text-center">
          Table number: <span className="text-4xl">{table.table_number}</span>
        </p>
        <p
          className={`p-3 rounded-lg text-center flex justify-center items-center ${
            table.status == "available" ? "bg-green-600" : "bg-red-300"
          }`}>
          Status: {table.status}
        </p>
      </div>
      {/* start_time,endTime,Remaining*/}
      <div className="mt-4">
        <p>Start time: {table.start_time}</p>
        <div>
          <p>End time: {endTime(table.start_time)}</p>
          <div className={`flex`}>
            <p>Remaining time :</p>
            <p
              className={`ms-1 ${
                remaining_time(table.start_time, endTime(table.start_time)) ===
                "Time's up."
                  ? "bg-orange-600 rounded-lg px-3"
                  : ""
              }`}>
              {remaining_time(table.start_time, endTime(table.start_time))}
            </p>
          </div>
        </div>
      </div>
      {/* Number of customers */}
      <p>
        Number of customers:{" "}
        {table.customer_count === 0 ? "-" : table.customer_count}
      </p>
      {/* btn */}
      {available == "unavailable" && (
        <div>
          {/* btn */}
          <div className="text-center">
            <button className="btn btn-error">Delete</button>
            <button className="btn btn-info">Edit</button>
          </div>
          {/* btn */}
          <div className="text-center">
            <button className="btn btn-accent">Reset</button>
            <button className="btn btn-secondary text-black">
              View QR code
            </button>
            <button className="btn btn-warning">Print</button>
          </div>
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={`${qrCodeBase}/${table.start_time}/${table.table_number}`}
            viewBox={`0 0 256 256`}
          />
        </div>
      )}

      {available == "available" && (
        <div>
          <button className="btn btn-error">Delete</button>
          <button className="btn btn-success">Start</button>
        </div>
      )}
    </div>
  );
}

export default Table_item;
