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

    return <span className={`${classText} p-2 mt-2 py-1 rounded-md border-2 border-black float-right`}>{showText}</span>;
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
          <article className="bg-amber-100 p-4 shadow-lg rounded overflow-auto max-h-[220px] lg:col-span-2 border-2 border-black">
            <p className="font-bold text-center">ออร์เดอร์ล่าสุด</p>
            {latestOrder.map((order) => (
              <div key={order.order_id} className="rounded bg-blue-100 p-2 m-2 shadow-lg">
                <p>
                  <span>โต๊ะ {order.order_table}</span>
                  <span>({order.order_id}) </span>
                  <span>
                    {moment(order.order_date)
                      .add(543, "year")
                      .format("DD-MM-YYYY")}
                  </span>
                  <span> {order_status_text(order.order_status)}</span>
                </p>
                <p>- {order.orders}</p>
              </div>
            ))}
          </article>
          {/* <article className="bg-white p-4 shadow rounded">
            <p className="font-bold">อาหารที่ขาย</p>
            {foods.map((food) => (
              <p key={food.food_id}>{food.food_name}</p>
            ))}
          </article> */}
          <article className="bg-amber-100 p-4 shadow-lg rounded grid-cols-1 md:col-span-2 lg:col-span-4 border-2 border-black">
            <FoodChart latestOrder={latestOrder} />
          </article>
          <article className="bg-amber-100 p-4 shadow-lg rounded grid-cols-1 md:col-span-2 lg:col-span-4 border-2 border-black">
            <Customer_history />
          </article>
        </section>
      </main>
    </>
  );
}
