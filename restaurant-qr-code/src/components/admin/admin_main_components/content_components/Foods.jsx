import axios from "axios";
import React, { useEffect, useState } from "react";
import FoodItem from "./Foods_components/FoodItem";
import AddFoodModal from "./Foods_components/AddFoodModal";
import { backend_api } from "../../../../../backend_api";

function Foods() {
  const [foodMenus, setFoodMenus] = useState([]);
  const [filterMenu, setFilterMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [categories, setCategories] = useState([]);
  const [isAddingFood, setIsAddingFood] = useState(false); // State to manage modal visibility
  const [viewCategory, setViewCategory] = useState("0");
  async function getMenu() {
    setIsLoading(true); // Set loading state while fetching data
    try {
      const response = await axios.get(
        `${backend_api}/food/menu`
      );
      setFoodMenus(response.data);
      setFilterMenu(response.data);
    } catch (error) {
      console.error("Error fetching food menu:", error);
      alert("Error fetching food menu:", error);
    } finally {
      setIsLoading(false); // Reset loading state after request completes
    }
  }

  async function getCategory() {
    setIsLoading(true); // Set loading state while fetching data
    try {
      const response = await axios.get(
        `${backend_api}/category/categories`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Error fetching categories:", error);
    } finally {
      setIsLoading(false); // Reset loading state after request completes
    }
  }

  useEffect(() => {
    getCategory();
    getMenu();
  }, []);

  const handleDelete = async (foodId) => {
    try {
      await axios.delete(`${backend_api}/food/menu/${foodId}`);
      getCategory();
      getMenu();
    } catch (error) {
      console.error("Error deleting food item:", error);
      alert("Error deleting food item:", error);
    }
  };

  const handleAddFood = (newFood) => {
    setFoodMenus((prevMenus) => [...prevMenus, newFood]);
    setIsAddingFood(false); // Close modal after adding food
  };

  const handleViewCategory = () => {
    if (viewCategory == 0) {
      setFilterMenu(foodMenus);
      return;
    }
    const filteredFood = foodMenus.filter((f) => f.category_id == viewCategory);
    console.log(filteredFood);

    setFilterMenu(filteredFood);
  };

  useEffect(() => {
    handleViewCategory();
  }, [viewCategory]);

  return (
    <div className="container mx-auto p-4">
      <p className="text-lg font-bold">รายการอาหาร</p>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <select
              onChange={(e) => setViewCategory(e.target.value)}
              className="rounded shadow-lg p-2 me-3 hover:border-2 border-black">
              <option value="0" selected>
                View all menu.
              </option>
              {categories.map((c) => (
                <option value={c.category_id} key={c.category_id}>
                  {c.category_name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsAddingFood(true)}
              className="bg-green-500 hover:bg-green-900 text-white py-2 px-4 rounded-md shadow-lg">
              Add Food
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
            {filterMenu.map((menu, index) => (
              <FoodItem
                key={index}
                {...menu}
                categories={categories}
                onDelete={handleDelete}
                getCategory={getCategory}
                getMenu={getMenu}
                onEdit={(updatedFood) => {
                  // Update local state with edited food item
                  setFoodMenus((prevMenus) =>
                    prevMenus.map((item) =>
                      item.food_id === updatedFood.food_id ? updatedFood : item
                    )
                  );
                }}
              />
            ))}
          </div>
          {isAddingFood && (
            <AddFoodModal
              categories={categories}
              onAdd={handleAddFood}
              setIsAddingFood={setIsAddingFood}
              getCategory={getCategory}
              getMenu={getMenu}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Foods;
