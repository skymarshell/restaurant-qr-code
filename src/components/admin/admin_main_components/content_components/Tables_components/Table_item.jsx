import React, { useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import { HiMiniEllipsisVertical } from "react-icons/hi2";

function Table_item({ table, getTable, tableUrl }) {
  const maxTime = 150; // Maximum time in minutes
  const qrCodeBase = `http://localhost:5173/customer`; // Base URL for QR code
  const [viewQrCode, setViewQrCode] = useState(false);
  const [edit, setEdit] = useState(false);
  const [customerNumber, setCustomerNumber] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

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
    if (start_time == "-") {
      return "-";
    }

    let splitDateTime = String(start_time).split(" ");
    let partDate = splitDateTime[0];
    let partTime = splitDateTime[1];

    const [startTimeHour, startTimeMinute] = partTime.split(":").map(Number);

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
    start_time = start_time.split(" ")[1];

    function timeToMinutes(time) {
      const [hour, minute] = time.split(":").map(Number);
      return hour * 60 + minute;
    }

    // Get current time and convert to minutes
    const currentTime = getDateTime().split(" ")[1];
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

  function handleViewQrCode() {
    setViewQrCode(!viewQrCode);
  }

  async function handleStart(e, tableNumber) {
    e.preventDefault();
    try {
      const response = await axios.put(`${tableUrl}/table/start`, {
        table_number: tableNumber,
        customer_count: customerNumber,
        start_time: getDateTime(),
      });
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
      alert(error);
    }
    getTable();
  }

  function handleEdit() {
    setEdit(!edit);
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setCustomerNumber(value);
    if (parseInt(value) < 1) {
      setErrorMessage(
        "Number of customers must be greater than or equal to 1."
      );
    } else {
      setErrorMessage("");
    }
  };

  async function handleReset(tableNumber) {
    try {
      if (confirm(`Reset table ${tableNumber} ? `) == true) {
        const response = await axios.put(`${tableUrl}/table/reset`, {
          table_number: tableNumber,
        });
        getTable();
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  function removeSeconds(timeString) {
    // Split the timeString by colon
    let timeParts = timeString.split(":");

    // Check if the timeParts array has at least two elements (hours and minutes)
    if (timeParts.length >= 2) {
      // Join the first two parts (hours and minutes) with a colon
      return timeParts[0] + ":" + timeParts[1];
    }

    // Return the original string if it's not in the expected format
    return timeString;
  }

  return (
    <div className="border border-white p-4 relative">
      {/* ..., delete ,edit */}
      <div className="w-full mb-3 flex sm:flex-row flex-col-reverse justify-end sm:items-center items-end">
        {edit && (
          <div className="w-full flex gap-4 mt-3 sm:mt-0 sm:me-3 sm:flex-row flex-col justify-center sm:justify-end items-center">
            <button className="w-1/2  sm:w-auto btn btn-error">Delete</button>
            <button className="w-1/2 sm:w-auto btn btn-info">Edit</button>
          </div>
        )}
        <HiMiniEllipsisVertical
          onClick={handleEdit}
          className="cursor-pointer"
        />
      </div>
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
      {/* show all info if unavailable */}
      {table.status == "unavailable" && (
        <>
          {/* start_time,endTime,Remaining*/}
          <div className="mt-4">
            <p>Start time: {removeSeconds(table.start_time.split(" ")[1])}</p>
            <div>
              <p>End time: {endTime(table.start_time)}</p>
              <div className={`flex`}>
                <p>Remaining time :</p>
                <p
                  className={`ms-1 ${
                    remaining_time(
                      table.start_time,
                      endTime(table.start_time)
                    ) === "Time's up."
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
        </>
      )}
      {/* btn*/}
      <div className="mt-2">
        {/* btn if unavailable*/}
        {table.status == "unavailable" && (
          <div>
            {/* btn */}
            <div className="flex justify-center items-center gap-x-3">
              <button
                onClick={() => handleReset(table.table_number)}
                className="btn btn-accent">
                Reset
              </button>
              <button
                onClick={handleViewQrCode}
                className="btn btn-secondary text-black">
                View QR code
              </button>
            </div>
            {viewQrCode == true && (
              <div className="text-center absolute w-full h-full inset-0 bg-black bg-opacity-80">
                <QRCode
                  className="bg-white h-2/3 p-3 mx-auto"
                  value={`${qrCodeBase}/${table.start_time}/${table.table_number}`}
                />
                <div className="mt-2 flex items-center justify-center gap-4">
                  <button className="btn btn-error" onClick={handleViewQrCode}>
                    Close
                  </button>
                  <button className="btn btn-warning">Print</button>
                </div>
              </div>
            )}
          </div>
        )}
        {/* btn if available*/}
        {table.status == "available" && (
          <div className="text-center">
            <label htmlFor="customer_count">Number of customers</label>
            <form
              className="flex flex-col justify-center items-center"
              onSubmit={(e) => handleStart(e, table.table_number)}>
              <input
                type="number"
                id="customer_count"
                required
                className="w-1/2 p-1 rounded-lg"
                min={1}
                onChange={handleChange}
              />
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <button type="submit" className="btn btn-success w-1/2 mt-3">
                Start
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Table_item;
