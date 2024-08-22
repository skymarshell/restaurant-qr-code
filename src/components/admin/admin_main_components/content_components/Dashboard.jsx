import axios from "axios";
import React, { useEffect, useState } from "react";
//icon
import { FaSearch } from "react-icons/fa";

// Dashboard Component
export default function Dashboard() {
  const date = new Date();
  const currentMonth = date.getMonth() + 1; // Month is 0-indexed, so add 1
  const currentYear = date.getFullYear();

  const [customerCount, setCustomerCount] = useState(0);
  const [customerCountAllYear, setCustomerCountAllYear] = useState(0);
  const [categories, setCategories] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [foods, setFoods] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Fetch data on mount or when the selected month/year changes
  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          `http://localhost:3000/customer_order/analysis/${selectedMonth}/${selectedYear}`
        );
        setCustomerCount(response.data.customerCount);
        setCustomerCountAllYear(response.data.customerAllYearCount);
        setCategories(response.data.category);
        setCustomerOrders(response.data.customerOrders);
        setFoods(response.data.food);
      } catch (error) {
        alert(error);
      }
    }
    getData();
  }, [selectedMonth, selectedYear]);

  return (
    <>
      <section className="flex items-center">
        <MonthSelect setSelectMonth={setSelectedMonth} selectedMonth={selectedMonth} />
        <YearSelect setSelectYear={setSelectedYear} selectedYear={selectedYear} currentYear={currentYear} />
      </section>

      <main className="mt-10">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article className="bg-white p-4 shadow rounded flex flex-col justify-center items-center text-center h-full">
            <p className="font-bold">จำนวนลูกค้า</p>
            <p className="text-2xl">
              {customerCount == null ? "0" : customerCount}
            </p>
            <p className="text-sm">
              รวมทั้งปี:
              {customerCountAllYear == null ? "0" : customerCountAllYear}
            </p>
          </article>
          <article className="bg-white p-4 shadow rounded">
            <p className="font-bold">หมวดหมู่สินค้า</p>
            {categories.map((category) => (
              <p key={category.category_id}>{category.category_name}</p>
            ))}
          </article>
          <article className="bg-white p-4 shadow rounded">
            <p className="font-bold">ออร์เดอร์ล่าสุด</p>
            {customerOrders.slice(0, 5).map((order) => (
              <p key={order.order_id}>
                โต๊ะ {order.order_table} - {order.orders}
              </p>
            ))}
          </article>
          <article className="bg-white p-4 shadow rounded">
            <p className="font-bold">อาหารที่ขาย</p>
            {foods.map((food) => (
              <p key={food.food_id}>{food.food_name}</p>
            ))}
          </article>
        </section>
      </main>
    </>
  );
}

// MonthSelect Component
function MonthSelect({ setSelectMonth, selectedMonth }) {
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
      onChange={(e) => setSelectMonth(parseInt(e.target.value))}
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
function YearSelect({ setSelectYear, selectedYear, currentYear }) {
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
      onChange={(e) => setSelectYear(parseInt(e.target.value))}>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
}
