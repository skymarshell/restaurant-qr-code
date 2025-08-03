/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState , useRef } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { backend_api } from "../../../../../../backend_api";

function Customer_history() {

  const [customer_count, setCustomer_count] = useState([]);

  const [onlyDate, setOnlyDate] = useState([]);
  const [sum, setSum] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state

  const now = new Date();
  const [selectMonth, setSelectMonth] = useState(now.getMonth() + 1);
  const [selectYear, setSelectYear] = useState(now.getFullYear());



  const intervalRef = useRef(null); // เก็บ interval id

  useEffect(() => {
    async function getCustomer_history() {
      setLoading(true);
      try {
        const response = await axios.get(`${backend_api}/dashboard/customer_history_chart`, {
          params: {
            month: selectMonth,
            year: selectYear,
          },
        });

        setCustomer_count(response.data.map((ad) => Number(ad.total_customers)));
        setOnlyDate(response.data.map((ad) => Number(ad.date.split("-")[2])));
        setSum(response.data.reduce((acc, ad) => acc + Number(ad.total_customers), 0));
      } catch (error) {
        console.error("Error fetching customer history:", error);
      } finally {
        setLoading(false);
      }
    }

  // ✅ ดึงข้อมูลทันทีเมื่อ selectMonth หรือ selectYear เปลี่ยน
  getCustomer_history();

  // ✅ เคลียร์ interval เดิมถ้ามี
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }

  // ✅ ตั้ง interval ใหม่
  intervalRef.current = setInterval(() => {
    getCustomer_history();
  }, 10000);

  // ✅ เคลียร์ interval เมื่อ component ถูก unmount
  return () => clearInterval(intervalRef.current);

}, [selectMonth, selectYear]);

  return (
    <div>
      <div>
        <MonthSelect
          selectMonth={selectMonth}
          setSelectMonth={setSelectMonth}
        />
        <YearSelect selectYear={selectYear} setSelectYear={setSelectYear} />
      </div>
      <p>รวม {sum} คน </p>
      {loading ? ( // Conditional rendering based on loading state
        <p>Loading...</p> // You can replace this with a spinner or other loading indicator
      ) : (
        <LineChart
          xAxis={[{
            label: "วันที่",
            data: [0, ...onlyDate],
            scaleType: "linear",
          }]}
          yAxis={[{ label: "ยอดลูกค้า" }]}
          series={[{
            label: `เดือน ${selectMonth} ปี ${selectYear + 543}`,
            data: [0, ...customer_count],
          }]}
          barLabel="value"
          height={400}
        />
      )}
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
    <>
      <label htmlFor="select_year">ปี</label>
      <select
        name="select_year"
        id="select_year"
        className="rounded shadow-lg p-2 me-3 hover:border-2 border-black ml-1"
        value={selectYear}
        onChange={(e) => setSelectYear(Number(e.target.value))}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year + 543}
          </option>
        ))}
      </select>
    </>
  );
}

function MonthSelect({ selectMonth, setSelectMonth }) {
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
    <>
      <label htmlFor="select_month">เดือน</label>
      <select
        className="rounded shadow-lg p-2 me-3 mb-1 ml-1 hover:border-2 border-black"
        value={selectMonth}
        onChange={(e) => setSelectMonth(Number(e.target.value))}>
        {months.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </>
  );
}

export default Customer_history;
