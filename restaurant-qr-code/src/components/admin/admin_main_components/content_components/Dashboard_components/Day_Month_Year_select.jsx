import React from "react";

// Day_Month_Year_select Component
function Day_Month_Year_select({
  selectedDay,
  setSelectedDay,
  currentDay,
  setSelectedMonth,
  selectedMonth,
  setSelectedYear,
  selectedYear,
  currentYear,
  countCustomerByDate,
  countCustomerAllMonth,
  customerCountAllYear,
}) {
  return (
    <div>
      <DaySelect
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        currentDay={currentDay}
      />
      <MonthSelect
        setSelectedMonth={setSelectedMonth} // Fixed prop name
        selectedMonth={selectedMonth}
      />
      <YearSelect
        setSelectedYear={setSelectedYear} // Fixed prop name
        selectedYear={selectedYear}
        currentYear={currentYear}
      />
      <div className="mt-10">
        <p className="font-bold">
          จำนวนลูกค้าวันที่ {selectedDay}/{selectedMonth}/{selectedYear + 543} :
          {countCustomerByDate ? `${countCustomerByDate} คน` : "0 คน"}
        </p>
        <p className="text-sm">
          เดือน{selectedMonth} :{" "}
          {countCustomerAllMonth ? `${countCustomerAllMonth} คน` : "0 คน"}
        </p>
        <p className="text-sm">
          รวมทั้งปี{selectedYear + 543}:{" "}
          {customerCountAllYear ? `${customerCountAllYear} คน` : "0 คน"}
        </p>
      </div>
    </div>
  );
}

// DaySelect Component
function DaySelect({ selectedDay, setSelectedDay, currentDay }) {
  const day = [];
  for (let index = 1; index <= 31; index++) {
    day.push(index);
  }
  return (
    <select
      name="select_day"
      id="select_day"
      value={selectedDay}
      onChange={(e) => setSelectedDay(parseInt(e.target.value))}
      className="border rounded p-2 me-3">
      {day.map((d) => (
        <option key={d} value={d}>
          {d}
        </option>
      ))}
    </select>
  );
}

// MonthSelect Component
function MonthSelect({ setSelectedMonth, selectedMonth }) {
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
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
      className="border rounded p-2">
      {months.map((month) => (
        <option key={month.value} value={month.value}>
          {month.label}
        </option>
      ))}
    </select>
  );
}

// YearSelect Component
function YearSelect({ setSelectedYear, selectedYear, currentYear }) {
  const years = [];
  for (let index = currentYear; index >= currentYear - 3; index--) {
    years.push(index);
  }

  return (
    <select
      name="select_year"
      id="select_year"
      value={selectedYear}
      className="ms-3 border rounded p-2"
      onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
      {years.map((year) => (
        <option key={year} value={year}>
          {year + 543}
        </option>
      ))}
    </select>
  );
}

export default Day_Month_Year_select;
