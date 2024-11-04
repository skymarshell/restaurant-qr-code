import React, { useRef, useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import { HiMiniEllipsisVertical } from "react-icons/hi2";
import { fullTime } from "../../../../../common_info";

function Table_item({ table, getTable, tableUrl }) {
  const maxTime = fullTime; // Maximum time in minutes
  const qrCodeBase = `http://localhost:5173/customer`; // Base URL for QR code
  const [viewQrCode, setViewQrCode] = useState(false);
  const [edit, setEdit] = useState(false);
  const [customerNumber, setCustomerNumber] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const start_ref = useRef(null);
  const end_ref = useRef(null);

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

    const [startTimeHour, startTimeMinute] = String(partTime)
      .split(":")
      .map(Number);

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
    // 2024-10-01 20:56:17
    // console.log(start_time);
    // 23:26
    //console.log("endTime", end_time);

    const date_start = start_time.split(" ")[0].split("-");
    // console.log(date_start);

    start_time = start_time.split(" ")[1];
    //console.log(date_start);
    const startDay = date_start[2];
    const startMonth = date_start[1];
    const startYear = date_start[0];

    const D = new Date();
    const cDate = parseInt(D.getDate());
    const cMonth = parseInt(D.getMonth() + 1);
    const cYear = D.getFullYear();

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

    let date1Current = new Date(
      `${String(cMonth).padStart(2, "0")}/${String(cDate).padStart(
        2,
        "0"
      )}/${String(cYear)}`
    );
    let date2Start = new Date(
      `${String(startMonth).padStart(2, "0")}/${String(startDay).padStart(
        2,
        "0"
      )}/${String(startYear)}`
    );

    // Calculating the time difference
    // of two dates
    let Difference_In_Time = date1Current.getTime() - date2Start.getTime();

    // Calculating the no. of days between
    // two dates
    let Difference_In_Days = Math.round(
      Difference_In_Time / (1000 * 3600 * 24)
    );

    // If the remaining minutes are negative, it means the time is up
    if (remainingMinutes < 0 || Difference_In_Time >= 2) {
      try {
        const response = axios.put(
          `http://localhost:3000/tables/table/time_up`,
          { table_number: table.table_number }
        );
      } catch (error) {
        alert(error);
      }
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
      //alert(response.data.message);
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
    let timeParts = String(timeString).split(":");

    // Check if the timeParts array has at least two elements (hours and minutes)
    if (timeParts.length >= 2) {
      // Join the first two parts (hours and minutes) with a colon
      return timeParts[0] + ":" + timeParts[1];
    }

    // Return the original string if it's not in the expected format
    return timeString;
  }

  function printQrCode(qrCodeValue) {
    const tableNumber = table.table_number;
    const customer_count = table.customer_count;
    const start_time = start_ref.current.innerText;
    const end_time = end_ref.current.innerText;
    // Open a new tab with the Print_QrCode route and pass the value as a query parameter
    window.open(
      `/print_QrCode?
        value=${qrCodeValue}&tableNumber=${tableNumber}&customerCount=${customer_count}&start=${start_time}&end=${end_time}`,
      "_blank",
      "width=800,height=600"
    );
  }
  
  // http://localhost:3000/tables/table/delete
  const deleteTable = (table_number) => {
  const response = axios.delete(`${tableUrl}/tables/table/delete/${table_number}`)
    .then(response => {
      console.log('Success:', response.data);
      getTable();
  })
  .catch(error => {
    console.error('Error:', error.response ? error.response.data : error.message);
  });
}

  // http://localhost:3000/tables/table/edit
  function editTable(id) {
    console.log(id);
    //อย่าลบ
    getTable();
  }

  const tableStatusClass =
    table.status === "available"
      ? "bg-green-300"
      : table.status === "unavailable"
      ? "bg-red-500"
      : "bg-yellow-500";

  return (
    <div className="p-4 relative shadow-lg bg-gradient-to-r from-pink-100 to-amber-50">
      {/* ..., delete ,edit */}
      <div className="w-full mb-3 flex sm:flex-row flex-col-reverse justify-end sm:items-center items-end">
        {edit && (
          <div className="w-full flex gap-4 mt-3 sm:mt-0 sm:me-3 sm:flex-row flex-col justify-center sm:justify-end items-center">
            <button
              onClick={(e) => deleteTable(table.table_number)}
              className="w-1/2  sm:w-auto btn btn-error">
              Delete
            </button>
            <button
              onClick={(e) => editTable(table.table_number)}
              className="w-1/2 sm:w-auto btn btn-info">
              Edit
            </button>
          </div>
        )}
        <HiMiniEllipsisVertical
          onClick={handleEdit}
          className="cursor-pointer"
        />
      </div>
      {/* table,status */}
      <div className="flex flex-col  justify-between border-b-2 border-black pb-3">
        <p className="text-center text-black font-semibold mb-2">
          Table number :{" "}
          <span className="text-xl font-bold">{table.table_number}</span>
        </p>
        <p
          className={`p-3 rounded-lg text-center flex justify-center items-center shadow-lg border-2 border-black mb-1 ${tableStatusClass}`}>
          Status :{" "}
          <span className="capitalize font-semibold">{table.status}</span>
        </p>
      </div>
      {/* show all info if unavailable */}
      {(table.status == "unavailable" || table.status == "time's up") && (
        <>
          {/* start_time,endTime,Remaining*/}
          <div className="mt-4">
            <p ref={start_ref}>
              Start time :{" "}
              <span className="text-red-500 font-semibold">
                {removeSeconds(table.start_time.split(" ")[1])}{" "}
              </span>
            </p>
            <div>
              <p ref={end_ref}>
                End time:{" "}
                <span className="text-red-500 font-semibold">
                  {endTime(table.start_time)}
                </span>
              </p>
              <div className={`flex`}>
                <p>Remaining time :</p>
                <p
                  className={`ms-1 text-red-500 font-semibold ${
                    remaining_time(
                      table.start_time,
                      endTime(table.start_time)
                    ) === "Time's up."
                      ? "underline "
                      : ""
                  }`}>
                  {remaining_time(table.start_time, endTime(table.start_time))}
                </p>
              </div>
            </div>
          </div>
          {/* Number of customers */}
          <p>
            Number of customers :{" "}
            <span className="text-red-500 font-semibold">
              {table.customer_count === 0 ? "-" : table.customer_count}
            </span>
          </p>
        </>
      )}
      {/* btn*/}
      <div className="mt-2">
        {/* btn if unavailable*/}
        {(table.status == "unavailable" || table.status == "time's up") && (
          <div>
            {/* btn */}
            <div className="flex justify-center items-center gap-x-3">
              <button
                onClick={() => handleReset(table.table_number)}
                className="rounded-md p-3 bg-green-400 hover:bg-green-800 shadow-lg">
                Reset
              </button>
              <button
                onClick={handleViewQrCode}
                className="rounded-md p-3 bg-blue-400 hover:bg-blue-800 shadow-lg">
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
                  <button
                    className="rounded-md p-3 bg-red-400 hover:bg-red-800 shadow-lg"
                    onClick={handleViewQrCode}>
                    Close
                  </button>
                  <button
                    className="rounded-md p-3 px-5 bg-yellow-400 hover:bg-yellow-800 shadow-lg"
                    onClick={() =>
                      printQrCode(
                        `${qrCodeBase}/${table.start_time}/${table.table_number}`
                      )
                    }>
                    Print
                  </button>
                  {/* <Link
                    className="btn btn-warning"
                    target="_blank"
                    to={`/print_QrCode?value=${encodeURIComponent(
                      `${qrCodeBase}/${table.start_time}/${table.table_number}`
                    )}&tableNumber=${encodeURIComponent(table.table_number)}`}>
                    Print QR Code
                  </Link> */}
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
              className="flex flex-col justify-center items-center mt-1"
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
              <button
                type="submit"
                className="rounded-md mt-5 p-10  py-2 bg-yellow-400 hover:bg-yellow-800 shadow-lg">
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
