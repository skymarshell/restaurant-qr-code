import axios from "axios";
import React, { useEffect, useState } from "react";

const FoodItem = ({
  food_id,
  food_name,
  food_description,
  food_image,
  category_id,
  onDelete,
  onEdit,
  categories,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editFoodName, setEditFoodName] = useState(food_name);
  const [editFoodDescription, setEditFoodDescription] =
    useState(food_description);
  const [isSaving, setIsSaving] = useState(false); // State to manage saving state

  const confirmDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${food_name}?`)) {
      onDelete(food_id);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    setIsSaving(true); // Set saving state while sending request
    try {
      const updatedFood = {
        food_id,
        food_name: editFoodName,
        food_description: editFoodDescription,
        food_image,
        category_id,
      };

      const response = await axios.put(
        `http://localhost:3000/food/menu/${food_id}`,
        updatedFood
      );

      if (response.status === 200) {
        alert(`Food item with ID ${food_id} updated successfully`);
        onEdit(updatedFood); // Update local state or trigger reload
      }
    } catch (error) {
      console.error("Error updating food item:", error);
      alert("Error updating food item:", error);
    } finally {
      setIsSaving(false); // Reset saving state after request completes
      setEditMode(false); // Exit edit mode after saving
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.category_id === categoryId);
    return category ? category.category_name : "Unknown Category";
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      <img
        src={food_image}
        alt={food_name}
        className="w-full h-32 object-cover mb-4"
      />
      {editMode ? (
        <div className="mb-4">
          <input
            type="text"
            value={editFoodName}
            onChange={(e) => setEditFoodName(e.target.value)}
            className="w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <textarea
            value={editFoodDescription}
            onChange={(e) => setEditFoodDescription(e.target.value)}
            rows="3"
            className="w-full mt-2 px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold">{food_name}</h2>
          <p className="text-gray-500">{food_description}</p>
        </>
      )}
      <p className="text-gray-700 font-semibold">
        Category : {getCategoryName(category_id)}
      </p>
      <div className="mt-4 flex justify-end gap-1">
        {editMode ? (
          <>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
              onClick={() => setEditMode(false)}>
              Cancel
            </button>
            <button
              className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-2 ${
                isSaving && "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleSave}
              disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md mr-2">
              Delete
            </button>
            <button
              onClick={handleEdit}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const AddFoodModal = ({ categories, onAdd, setIsAddingFood, getCategory }) => {
  const [foodName, setFoodName] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [foodImageFile, setFoodImageFile] = useState(null); // State for file input
  const [categoryId, setCategoryId] = useState("");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     let fileName;
  //     // Append file with timestamp to FormData if a file is selected
  //     if (foodImageFile) {
  //       const originalName = foodImageFile.name;
  //       const fileExtension = foodImageFile.name.split(".").pop();
  //       const timestamp = Date.now();
  //       fileName = `${originalName}_${timestamp}.${fileExtension}`;
  //     }
  //     console.log(
  //       `${foodName}\n${foodDescription}\n${fileName}\n${categoryId}`
  //     );
  //     const response = await axios.post("http://localhost:3000/food/menu", {
  //       food_name: foodName,
  //       food_description: foodDescription,
  //       food_image: fileName,
  //       category_id: categoryId,
  //     });

  //     if (response.status === 201) {
  //       alert("New food item added successfully");
  //       onAdd(response.data); // Notify parent component about the new addition
  //       // Clear form fields after successful addition
  //       setFoodName("");
  //       setFoodDescription("");
  //       setFoodImageFile(null);
  //       setCategoryId("");
  //       setIsAddingFood(false); // Close modal after successful addition
  //     }
  //   } catch (error) {
  //     console.log("Error adding new food item:", error);
  //     alert("Error adding new food item:", error);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("food_name", foodName);
      formData.append("food_description", foodDescription);
      formData.append("category_id", categoryId);
      formData.append("food_image", foodImageFile); // Append the file object
      const response = await axios.post(
        "http://localhost:3000/food/menu",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("New food item added successfully");
        onAdd(response.data); // Notify parent component about the new addition
        // Clear form fields after successful addition
        setFoodName("");
        setFoodDescription("");
        setFoodImageFile(null);
        setCategoryId("");
        setIsAddingFood(false); // Close modal after successful addition
      }
    } catch (error) {
      console.log("Error adding new food item:", error);
      alert("Error adding new food item:", error);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    // Clear form fields and close modal
    setFoodName("");
    setFoodDescription("");
    setFoodImageFile(null);
    setCategoryId("");
    setIsAddingFood(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFoodImageFile(file);
  };

  return (
    <div className="z-20  overflow-auto fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white  p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">Add New Food Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Food Name
            </label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Food Description
            </label>
            <textarea
              value={foodDescription}
              onChange={(e) => setFoodDescription(e.target.value)}
              rows="3"
              className="w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Food Image
            </label>
            <input
              type="file"
              accept="image/png,  image/jpeg"
              onChange={handleFileChange}
              className="w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
              required>
              <option value="" disabled hidden>
                Select Category
              </option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md mr-2">
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
              Add Food
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function Foods() {
  const [foodMenus, setFoodMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [categories, setCategories] = useState([]);
  const [isAddingFood, setIsAddingFood] = useState(false); // State to manage modal visibility

  async function getMenu() {
    setIsLoading(true); // Set loading state while fetching data
    try {
      const response = await axios.get("http://localhost:3000/food/menu");
      setFoodMenus(response.data);
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
        "http://localhost:3000/category/categories"
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
      await axios.delete(`http://localhost:3000/food/menu/${foodId}`);
      setFoodMenus((prevMenus) =>
        prevMenus.filter((menu) => menu.food_id !== foodId)
      );
    } catch (error) {
      console.error("Error deleting food item:", error);
      alert("Error deleting food item:", error);
    }
  };

  const handleAddFood = (newFood) => {
    getMenu();
    setFoodMenus((prevMenus) => [...prevMenus, newFood]);
    setIsAddingFood(false); // Close modal after adding food
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Food Menu</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsAddingFood(true)}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">
              Add Food
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {foodMenus.map((menu, index) => (
              <FoodItem
                key={index}
                {...menu}
                categories={categories}
                onDelete={handleDelete}
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
