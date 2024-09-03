import axios from "axios";
import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts";
import { ChartContainer } from "@mui/x-charts/ChartContainer";
import { BarPlot } from "@mui/x-charts/BarChart";
//icon
import { FaSearch } from "react-icons/fa";
//Componentts
import Day_Month_Year_select from "./Dashboard_components/Day_Month_Year_select";
import FoodChart from "./Dashboard_components/FoodChart";
import Customer_history from "./Dashboard_components/Customer_history";
// Dashboard Component
export default function Dashboard() {
  const date = new Date();
  const currentDay = date.getDate();
  const currentMonth = date.getMonth() + 1; // Month is 0-indexed, so add 1
  const currentYear = date.getFullYear();

  const [countCustomerByDate, setCountCustomerByDate] = useState(0);
  const [countCustomerAllMonth, setCountCustomerAllMonth] = useState(0);
  const [customerCountAllYear, setCustomerCountAllYear] = useState(0);
  const [categories, setCategories] = useState([]);
  const [latestOrder, setLatestOrder] = useState([]);
  const [foods, setFoods] = useState([]);

  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  //function fetch data
  async function getData() {
    try {
      const response = await axios.get(
        `http://localhost:3000/dashboard/analysis/${selectedDay}/${selectedMonth}/${selectedYear}`
      );
      setCountCustomerByDate(response.data.countCustomerByDate);
      setCustomerCountAllYear(response.data.customerAllYearCount);
      setCountCustomerAllMonth(response.data.countCustomerAllMonth);
      setCategories(response.data.category);
      setLatestOrder(response.data.customerOrders.reverse());
      setFoods(response.data.food);
    } catch (error) {
      alert(error);
    }
  }
  // Fetch data on mount or when the selected month/year changes
  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [selectedDay, selectedMonth, selectedYear]);

  return (
    <>
      <main className="mt-10">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article className="bg-white p-4 shadow rounded  text-center h-full relative">
            <div>
              <Day_Month_Year_select
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                currentDay={currentDay}
                setSelectedMonth={setSelectedMonth}
                selectedMonth={selectedMonth}
                setSelectedYear={setSelectedYear}
                selectedYear={selectedYear}
                currentYear={currentYear}
                countCustomerByDate={countCustomerByDate}
                countCustomerAllMonth={countCustomerAllMonth}
                customerCountAllYear={customerCountAllYear}
              />
            </div>
          </article>
          <article className="bg-white p-4 shadow rounded">
            <p className="font-bold text-center">หมวดหมู่สินค้า</p>
            {categories.map((category) => (
              <p key={category.category_id}>{category.category_name}</p>
            ))}
          </article>
          <article className="bg-white p-4 shadow rounded overflow-auto max-h-[220px]">
            <p className="font-bold text-center">ออร์เดอร์ล่าสุด</p>
            {latestOrder.map((order) => (
              <p key={order.order_id} className="border-b-4 ">
                โต๊ะ {order.order_table}({order.order_id}){" "}
                <p>- {order.orders}</p>
              </p>
            ))}
          </article>
          <article className="bg-white p-4 shadow rounded">
            <p className="font-bold">อาหารที่ขาย</p>
            {foods.map((food) => (
              <p key={food.food_id}>{food.food_name}</p>
            ))}
          </article>
          <article className="bg-white p-4 shadow rounded grid-cols-1 md:col-span-2 lg:col-span-4">
            <FoodChart latestOrder={latestOrder} />
          </article>
          <article className="bg-white p-4 shadow rounded grid-cols-1 md:col-span-2 lg:col-span-4">
            <Customer_history />
          </article>
        </section>
      </main>
    </>
  );
}
