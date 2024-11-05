import axios from "axios";
import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts";
import { ChartContainer } from "@mui/x-charts/ChartContainer";
import { BarPlot } from "@mui/x-charts/BarChart";
import moment from "moment/moment";
//icon
import { FaSearch } from "react-icons/fa";
//Componentts
import Day_Month_Year_select from "./Dashboard_components/Day_Month_Year_select";
import FoodChart from "./Dashboard_components/FoodChart";
import Customer_history from "./Dashboard_components/Customer_history";
import LatestOrder from "./Dashboard_components/LatestOrder";
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
  const [foods, setFoods] = useState([]);

  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  //function fetch data
  async function getData() {
    try {
      const response = await axios.get(
        `https://webdev-backend-2e1ad2316dae.herokuapp.com/dashboard/analysis/${selectedDay}/${selectedMonth}/${selectedYear}`
      );

      // Ensure the response data matches the expected structure
      setCountCustomerByDate(response.data.customerCountByDate); // Adjusted property name
      setCountCustomerAllMonth(response.data.customerCountByMonth); // Adjusted property name
      setCustomerCountAllYear(response.data.customerCountByYear); // Adjusted property name
    } catch (error) {
      console.error("Error fetching data:", error);
      //alert("Failed to fetch data. Please try again."); // More user-friendly message
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

  //
  function order_status_text(status) {
    let showText, classText;

    if (status == 1) {
      showText = "Order completed";
      classText = "bg-green-400";
    } else if (status == -1) {
      showText = "Order canceled";
      classText = "bg-red-400";
    } else {
      showText = "Waiting";
      classText = "bg-yellow-400";
    }

    return (
      <span
        className={`${classText} p-2 mt-2 py-1 rounded-md border-2 border-black float-right`}>
        {showText}
      </span>
    );
  }

  return (
    <>
      <main className="mt-10">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article className="bg-amber-100  p-4 shadow-lg rounded  text-center h-full relative lg:col-span-2 border-2 border-black">
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
          {/* <article className="bg-white p-4 shadow rounded">
            <p className="font-bold text-center">หมวดหมู่สินค้า</p>
            {categories.map((category) => (
              <p key={category.category_id}>{category.category_name}</p>
            ))}
          </article> */}

          <LatestOrder />

          {/* <article className="bg-white p-4 shadow rounded">
            <p className="font-bold">อาหารที่ขาย</p>
            {foods.map((food) => (
              <p key={food.food_id}>{food.food_name}</p>
            ))}
          </article> */}
          <article className="bg-amber-100 p-4 shadow-lg rounded grid-cols-1 md:col-span-2 lg:col-span-4 border-2 border-black">
            <FoodChart />
          </article>
          <article className="bg-amber-100 p-4 shadow-lg rounded grid-cols-1 md:col-span-2 lg:col-span-4 border-2 border-black">
            <Customer_history />
          </article>
        </section>
      </main>
    </>
  );
}
