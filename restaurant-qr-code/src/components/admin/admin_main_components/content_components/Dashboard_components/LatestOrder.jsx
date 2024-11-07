import axios from "axios";
import React, { useState, useEffect } from "react";
import moment from "moment/moment";
import { backend_api } from "../../../../../../backend_api";

function LatestOrder() {
  const [latestOrder, setLatestOrder] = useState([]);

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
      <span className={`${classText} rounded-md border border-black p-1`}>
        {showText}
      </span>
    );
  }

  async function getOrder() {
    try {
      const response = await axios.get(
        `${backend_api}/dashboard/latest_order`
      );
      setLatestOrder(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getOrder();
    const intervalId = setInterval(getOrder, 30 * 1000);

    return () => clearInterval(intervalId); // Correct cleanup for the interval
  }, []);

  return (
    <article className="bg-amber-100 p-4 shadow-lg rounded overflow-auto max-h-[220px] lg:col-span-2 border-2 border-black">
      <p className="font-bold text-center">ออร์เดอร์ล่าสุด</p>
      {latestOrder.map((order) => (
        <div
          key={order.order_id}
          className="rounded bg-blue-100 p-2 m-2 shadow-lg flex justify-between items-start">
          <div>
            <p>
              <span>โต๊ะ {order.order_table}</span>
              <span>({order.order_id}) </span>
              <span>
                {moment(order.order_date).add(543, "year").format("DD-MM-YYYY")}
              </span>
            </p>
            <p>- {order.orders}</p>
          </div>
          <span className="self-start ml-2 ">
            {order_status_text(order.order_status)}
          </span>
        </div>
      ))}
    </article>
  );
}

export default LatestOrder;
