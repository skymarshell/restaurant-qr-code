import React, { useContext } from "react";
import { DataContext } from "../Customer_main";
import axios from "axios";

//sub components
import Menu_item from "./menu_components/Menu_item";

function Menu() {
  const { menus, categories, orders, setOrders } = useContext(DataContext);

  function increase_quantity(name) {
    const findOrderIndex = orders.findIndex((order) => order.name === name);
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
  }

  function decrease_quantity(name) {
    const findOrderIndex = orders.findIndex((order) => order.name === name);

    if (findOrderIndex !== -1) {
      if (orders[findOrderIndex].quantity === 1) {
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
    }
  }

  return (
    <main className="md:max-w-screen-md  mx-auto p-4">
      {categories.map((category,index) => (
        <section className="mt-7 border-2 border-solid border-gray-300 rounded-lg p-4 shadow-lg" key={index}>
          <h1 >{category.category_name}</h1>
          {menus
            .filter((menu) => menu.category_id == category.category_id)
            .map((menu) => (
              <ul key={menu.food_id}>
                <Menu_item name={menu.food_name} image={menu.food_image}  />
              </ul>
            ))}
        </section>
      ))}
    </main>
  );
}

export default Menu;
