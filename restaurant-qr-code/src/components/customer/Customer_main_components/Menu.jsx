import React, { useContext } from "react";
import { DataContext } from "../Customer_main";
import axios from "axios";

//sub components
import Menu_item from "./menu_components/Menu_item";

function Menu() {
  const { menus, categories, orders, setOrders } = useContext(DataContext);

  const itemCount = (category_id) => {
    return menus.filter((menu) => category_id === menu.category_id).length;
  };

  return (
    <main className="md:max-w-screen-md  mx-auto p-4">
      {categories.map((category, index) =>
        itemCount(category.category_id) === 0 ? null : (
          <section
            className="bg-red-100 mt-7 border-2  border-black rounded-lg p-4 shadow-lg"
            key={index}>
            <h1 className="font-semibold">{category.category_name}</h1>
            {menus
              .filter((menu) => menu.category_id == category.category_id)
              .map((menu) => (
                <ul key={menu.food_id}>
                  <Menu_item
                    name={menu.food_name}
                    image={menu.food_image}
                    desc={menu.food_description}
                  />
                </ul>
              ))}
          </section>
        )
      )}
    </main>
  );
}

export default Menu;
