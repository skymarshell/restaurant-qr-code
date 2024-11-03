import React, { useContext, useEffect } from "react";
import { OrderContext } from "../Orders";

function Order_select() {
  const {
    order,
    orderLength,
    viewMode,
    setViewMode,
    viewBy,
    setViewBy,
    viewDate,
    viewMonth,
    viewYear,
    setViewDate,
    setViewMonth,
    setViewYear,
  } = useContext(OrderContext);

  // Set initial date to today's date on component mount
  useEffect(() => {
    const today = new Date();
    setViewDate(today.getDate());
    setViewMonth(today.getMonth() + 1); // Month is 0-indexed
    setViewYear(today.getFullYear());
  }, [setViewDate, setViewMonth, setViewYear]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-gray-800 ">
        {viewMode === "view all orders"
          ? `Total orders: ${orderLength} orders`
          : viewMode === "waiting orders"
          ? `Waiting orders: ${orderLength} orders`
          : viewMode === "sent"
          ? `Sent orders: ${orderLength} orders`
          : `Cancel orders: ${orderLength} orders`}
      </h1>
      <div className="flex gap-3 mb-5 flex-col md:flex-row">
      <label htmlFor="status">ดูสถานะ</label>
        <select
          id="status"
          onChange={(e) => setViewMode(e.target.value)}
          value={viewMode}
          className="rounded shadow-lg p-2 me-3 hover:border-2 border-black">
          <option value="view all orders">ดูทุกสถานะ</option>
          <option value="waiting orders">กำลังรอ</option>
          <option value="sent">จัดส่งแล้ว</option>
          <option value="cancel">ยกเลิก</option>
        </select>
      </div>
      <label htmlFor="select-view-type">เลือกวัน-เวลา</label>
      <select
      className="rounded shadow-lg p-2 ms-2 hover:border-1 border-black"
        id="select-view-type"
        onChange={(e) => setViewBy(e.target.value)}
        value={viewBy}>
        {/* <option value="0">View all orders.</option> */}
        <option value="0">ดูทุกวัน-เวลา</option>
        <option value="1">ดูออเดอร์วันนี้</option>
        <option value="2">เลือกวันดูออเดอร์</option>
      </select>
      {viewBy === "2" && (
        <div className="flex gap-3 mt-3">
          <DaySelect />
          <MonthSelect />
          <YearSelect />
        </div>
      )}
    </div>
  );
}

function DaySelect() {
  const { viewMonth, viewYear, setViewDate, viewDate } =
    useContext(OrderContext);
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate(); // Get days in selected month

  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  return (
    <select
      name="select_day"
      id="select_day"
      value={viewDate}
      onChange={(e) => setViewDate(parseInt(e.target.value))}
      className="border rounded p-2">
      {days.map((d) => (
        <option key={d} value={d}>
          {d}
        </option>
      ))}
    </select>
  );
}

function MonthSelect() {
  const { setViewMonth, viewMonth } = useContext(OrderContext);
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
    <select
      name="select_month"
      id="select_month"
      value={viewMonth}
      onChange={(e) => setViewMonth(parseInt(e.target.value))}
      className="border rounded p-2">
      {months.map((month) => (
        <option key={month.value} value={month.value}>
          {month.label}
        </option>
      ))}
    </select>
  );
}

function YearSelect() {
  const { setViewYear, viewYear } = useContext(OrderContext);
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let index = currentYear; index >= currentYear - 3; index--) {
    years.push(index);
  }

  return (
    <select
      name="select_year"
      id="select_year"
      value={viewYear}
      className="ms-3 border rounded p-2"
      onChange={(e) => setViewYear(parseInt(e.target.value))}>
      {years.map((year) => (
        <option key={year} value={year}>
          {year + 543}
        </option>
      ))}
    </select>
  );
}

export default Order_select;
