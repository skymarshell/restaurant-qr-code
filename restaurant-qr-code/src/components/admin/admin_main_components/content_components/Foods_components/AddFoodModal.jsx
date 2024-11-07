import axios from "axios";
import React, { useEffect, useState } from "react";

const AddFoodModal = ({ categories, onAdd, setIsAddingFood, getMenu }) => {
  const [foodName, setFoodName] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [foodImageFile, setFoodImageFile] = useState(null); // State for file input
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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
    getMenu();
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
    <div
      onClick={() => setIsAddingFood(false)}
      className="z-20  overflow-auto fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-amber-100  p-4 rounded-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Add New Food Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black-100 ">
              Food Name
            </label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500 shadow-lg"
              placeholder="ระบุชื่อเมนูอาหาร"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black-100">
              Food Description
            </label>
            <textarea
              value={foodDescription}
              onChange={(e) => setFoodDescription(e.target.value)}
              rows="3"
              className="w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500 shadow-lg"
              placeholder="รายละเอียดอาหาร"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black-100">
              Food Image
            </label>
            <input
              type="file"
              accept="image/png,  image/jpeg"
              onChange={handleFileChange}
              className="w-full px-2 py-1  rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black-100">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500 shadow-lg"
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
              className="bg-red-500 hover:border-2 border-black text-white py-2 px-4 rounded-md mr-2 shadow-lg">
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:border-2 border-black text-white py-2 px-4 rounded-md shadow-lg">
              Add Food
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFoodModal;