import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../../Customer_main";
import axios from "axios";
import { backend_api } from "../../../../../backend_api";

function Menu_item({ name, image, desc }) {
  const { menus, categories, orders, setOrders } = useContext(DataContext);

  const [quantity, setQuantity] = useState(0); // State to manage quantity

  // Initialize and update local quantity state based on global orders state
  useEffect(() => {
    const order = orders.find((order) => order.name === name);
    setQuantity(order ? order.quantity : 0);
  }, [orders, name]);

  function increase_quantity(name) {
    const findOrderIndex = orders.findIndex((order) => order.name === name);
    //ยังไม่มีใน order
    if (findOrderIndex == -1) {
      setOrders((prevData) => [...prevData, { name, quantity: 1 }]);
    } else {
      const update = [...orders];
      update[findOrderIndex] = {
        ...update[findOrderIndex],
        quantity: update[findOrderIndex].quantity + 1,
      };

      setOrders(update);
    }
    setQuantity(quantity + 1); // Update local quantity state
  }

  function decrease_quantity(name) {
    const findOrderIndex = orders.findIndex((order) => order.name === name);

    if (findOrderIndex !== -1) {
      if (orders[findOrderIndex].quantity === 1) {
        //remove from order
        const update = orders.filter((order) => order.name !== name);
        setOrders(update);
      } else {
        const update = [...orders];
        update[findOrderIndex] = {
          ...update[findOrderIndex],
          quantity: update[findOrderIndex].quantity - 1,
        };
        setOrders(update);
      }
      setQuantity((q) => {
        quantity == 0 ? setQuantity(0) : setQuantity(q - 1);
      }); // Update local quantity state
    }
  }

  return (
    <>
      <li className="flex items-center justify-between  p-3 my-3 sm:gap-20 gap-6 border-0 border-solid shadow-md backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border-white/80 bg-white">
        <div>
          <img
            src={`${backend_api}/uploads/${image}`}
            alt={`${image}`}
            className={`w-[250px] lg:w-auto lg:h-[200px]`}
          />
          <p className="text-center">{name}</p>
          <p className="text-center">{desc}</p>
        </div>
        <div className="flex items-center justify-center md:gap-11  gap-4 me-6">
          <button onClick={() => decrease_quantity(name)}>-</button>
          <p>{quantity}</p>
          <button onClick={() => increase_quantity(name)}>+</button>
        </div>
      </li>
    </>
  );
}

export default Menu_item;
