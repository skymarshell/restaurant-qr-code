import axios from "axios";
import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts";
import { IoSearchOutline } from "react-icons/io5";

function FoodChart() {
  const [orders, setOrders] = useState({});
  const [foodKey, setFoodkey] = useState([]);
  const [foodValue, setFoodValue] = useState([]);
  const [viewMode, setViewMode] = useState("today");

  const now = new Date();

  const [selectDay, setSelectDay] = useState(now.getDate());
  const [selectMonth, setSelectMonth] = useState(now.getMonth() + 1);
  const [selectYear, setSelectYear] = useState(now.getFullYear());

  const [onlyMonth, setOnlyMonth] = useState(now.getMonth() + 1);

  const [text, setText] = useState("วันนี้");

  async function getOrders() {
    try {
      const response = await axios.get(
        `http://localhost:3000/dashboard/chart`,
        {
          params: {
            viewMode,
            selectDay,
            selectMonth,
            selectYear,
            onlyMonth,
          },
        }
      );

      setOrders(response.data);
      setFoodkey(response.data.foodKey);
      setFoodValue(response.data.foodValue);
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    getOrders();
    const ordersInterval = setInterval(() => {
      getOrders();
    }, 1000 * 1000);

    return () => {
      clearInterval(ordersInterval);
    };
  }, [viewMode, onlyMonth]);

  const handleButtonClick = () => {
    const getLabel = months.find((m) => m.value == selectMonth);
    setText(`${selectDay} ${getLabel.label} ${selectYear}`);
    setViewMode("select_day");
    getOrders();
  };

  const handleOnlyMonthSelection = (e) => {
    const month = e.target.value;
    setOnlyMonth(`${month}`); // Update the selected month
    setViewMode("onlyMonth"); // Set view mode to month view
    const getLabel = months.find((m) => m.value == e.target.value);
    setText(`เดือน${getLabel.label} ${now.getFullYear() + 543}`);
  };

  const day = [];
  for (let index = 1; index <= 31; index++) {
    day.push(index);
  }
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  return (
    <div className="relative">
      <h1 className="font-bold text-3xl text-center  mb-2">กราฟยอดสั่งอาหาร</h1>
      <div className="flex flex-wrap gap-3 mb-3 items-center ">
        <button
          onClick={() => {
            setViewMode("all");
            setText("ทั้งหมด");
          }}
          className="bg-blue-100 p-1 rounded shadow-lg hover:bg-blue-500">
          ทั้งหมด
        </button>
        <div>
          <label htmlFor="only_month">เดือน </label>
          <select
            id="only_month"
            className="rounded shadow-lg p-2 me-3 hover:border-2 border-black"
            onChange={(e) => {
              handleOnlyMonthSelection(e);
            }}
            value={onlyMonth}>
            {months.map((m) => (
              <option value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            setViewMode("7day");
            setText("7 วันย้อนหลัง");
          }}
          className="bg-blue-100 p-1 rounded shadow-lg hover:bg-blue-500">
          7 วันย้อนหลัง
        </button>
        <button
          onClick={() => {
            setViewMode("today");
            setText("วันนี้");
          }}
          className="bg-blue-100 p-1 rounded shadow-lg hover:bg-blue-500">
          วันนี้
        </button>
        <div className="flex flex-wrap justify-center items-center">
          <label htmlFor="select_date">วันที่</label>
          <div id="select_date">
            <select
              id="day"
              className="rounded-full shadow-lg p-2 me-3 ml-1 hover:border-2 border-black"
              onChange={(e) => setSelectDay(e.target.value)}
              value={selectDay}>
              {day.map((d) => (
                <option value={d}>{d}</option>
              ))}
            </select>
            <select
              id="month"
              className="rounded shadow-lg p-2 me-3 hover:border-2 border-black"
              onChange={(e) => setSelectMonth(e.target.value)}
              value={selectMonth}>
              {months.map((m) => (
                <option value={m.value}>{m.label}</option>
              ))}
            </select>
            <YearSelect selectYear={selectYear} setSelectYear={setSelectYear} />
          </div>
          <button className="ms-3  h-full" onClick={handleButtonClick}>
            <IoSearchOutline className="text-blue-500 w-6 h-6 hover:text-blue-700 transition duration-200 ease-in-out" />
          </button>
        </div>
      </div>
      <p className="absolute">ยอดขาย {text}</p>
      <BarChart
        series={[{ data: foodValue }]} // Ensure foodValue is an array of numbers
        xAxis={[{ scaleType: "band", data: foodKey }]} // Ensure foodKey is an array of strings
        className="w-full"
        height={300}
        barLabel="value"
      />
      <p className="absolute right-0 bottom-3">สินค้า</p>
    </div>
  );
}

function YearSelect({ selectYear, setSelectYear }) {
  const d = new Date();
  let year = d.getFullYear();
  const years = [];
  for (let index = year; index >= year - 3; index--) {
    years.push(index);
  }
  return (
    <select
      name="select_year"
      id="select_year"
      className="rounded shadow-lg p-2 me-3 hover:border-2 border-black"
      value={selectYear}
      onChange={(e) => setSelectYear(e.target.value)}>
      {years.map((year) => (
        <option key={year} value={year}>
          {year + 543}
        </option>
      ))}
    </select>
  );
}

export default FoodChart;
