import axios from "axios";
import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts";
import { LineChart } from "@mui/x-charts/LineChart";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

//https://testdouble.com/insights/guide-advanced-line-graphs-in-react-with-mui-x-charts

function Customer_history() {
  //ปี เดือน อาทิตย์ linear bar
  const data = [
    { date: "2024-09-01", customers: 120 },
    { date: "2024-09-02", customers: 200 },
    { date: "2024-09-03", customers: 150 },
    { date: "2024-09-04", customers: 170 },
    { date: "2024-09-05", customers: 210 },
    { date: "2024-09-06", customers: 160 },
    { date: "2024-09-07", customers: 190 },
  ];
  return (
    <div>
      <h1 className="text-center text-3xl font-bold">จำนวนลูกค้า</h1>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [20, 5.5, 2, 8.5, 1.5, 5],
            //area: true,
          },
        ]}
        className="w-full"
        height={300}
      />
    </div>
  );
}

export default Customer_history;
