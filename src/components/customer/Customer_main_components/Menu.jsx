import React, { useContext } from "react";
import { DataContext } from "../Customer_main"
import { menu } from "@material-tailwind/react";
function Menu() {
  const { menus, SetMenus, orders, setOrders } = useContext(DataContext);

  const item_style =
    "flex items-center   p-3 my-3 sm:gap-20 gap-6 border-0 border-solid shadow-md backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border-white/80 bg-white";
  const img_style = "w-[250px] lg:w-[300px]";
  const section_style =
    "mt-7 border-2 border-solid border-gray-300 rounded-lg p-4 shadow-lg";
  const h1_style = "text-4xl";

  function increase_quantity(id) {
    const findOrderIndex = orders.findIndex((order) => order.id === id);
    if (findOrderIndex == -1) {
      setOrders((prevData) => [...prevData, { id, quantity: 1 }]);
    } else {
      const update = [...orders];
      update[findOrderIndex] = {
        ...update[findOrderIndex],
        quantity: update[findOrderIndex].quantity + 1,
      };
      setOrders(update);
    }
  }

  function decrease_quantity(id) {
    const findOrderIndex = orders.findIndex((order) => order.id === id);

    if (findOrderIndex !== -1) {
      if (orders[findOrderIndex].quantity === 1) {
        const update = orders.filter((order) => order.id !== id);
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
      {/* เนื้อ */}
      <section className={`${section_style}`}>
        <h1 className={h1_style}>เนื้อ</h1>
        <ul>
          <li className={`${item_style} `}>
            <div>
              <img
                src="/เนื้อ/ฮิเรนิกุ Hireniku.png"
                alt="ฮิเรนิกุ Hireniku.png"
                className={`${img_style}`}
              />
              <p className="text-center">ฮิเรนิกุ</p>
            </div>

            <div className="flex items-center justify-center md:gap-11  gap-4">
              <button onClick={() => decrease_quantity(1)}>-</button>
              <p>0</p>
              <button onClick={() => increase_quantity(1)}>+</button>
            </div>
          </li>
          <li className={`${item_style}`}>
            <div>
              <img
                src="/เนื้อ/คินนิกุ kinnilu.png"
                className={`${img_style}`}
              />
              <p className="text-center">คินนิกุ</p>
            </div>

            <div className="flex items-center justify-center md:gap-11 gap-4">
              <button onClick={() => decrease_quantity(2)}>-</button>
              <p>0</p>
              <button onClick={() => increase_quantity(2)}>+</button>
            </div>
          </li>
        </ul>
      </section>

      {/* หมู */}
      <section className={`${section_style}`}>
        <h1 className={h1_style}>หมู</h1>
        <ul>
          <li className="flex items-center p-3 my-3 border-0 border-solid shadow-md backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border-white/80 bg-white gap-2">
            <p>หมูสันคอ</p>
            <button>-</button>
            <p>1</p>
            <button>+</button>
          </li>
          <li className="flex items-center p-3 my-3 border-0 border-solid shadow-md backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border-white/80 bg-white gap-2">
            <p>หมูสันนอก</p>
            <button>-</button>
            <p>1</p>
            <button>+</button>
          </li>
          <li className="flex items-center p-3 my-3 border-0 border-solid shadow-md backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border-white/80 bg-white gap-2">
            <p>เบคอน</p>
            <button>-</button>
            <p>1</p>
            <button>+</button>
          </li>
          <li className="flex items-center p-3 my-3 border-0 border-solid shadow-md backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border-white/80 bg-white gap-2">
            <p>หมูไผ่</p>
            <button>-</button>
            <p>1</p>
            <button>+</button>
          </li>
        </ul>
      </section>
    </main>
  );
}

export default Menu;
