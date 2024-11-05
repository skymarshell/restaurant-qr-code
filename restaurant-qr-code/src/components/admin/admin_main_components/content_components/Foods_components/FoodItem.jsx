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
  getCategory,
  getMenu,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editFoodName, setEditFoodName] = useState(food_name);
  const [editFoodDescription, setEditFoodDescription] =
    useState(food_description);
  const [editFoodCategory, setEditFoodCategory] = useState(category_id);
  const [foodImageFile, setFoodImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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
      if (!editFoodName) {
        alert("โปรดใส่ชื่อเมนู");
        return;
      }
      const formData = new FormData();
      formData.append("food_name", editFoodName);
      formData.append("old_food_name", food_image);
      formData.append("food_description", editFoodDescription);
      formData.append("category_id", editFoodCategory);
      if (foodImageFile) {
        formData.append("food_image", foodImageFile);
      }

      const response = await axios.put(
        `https://webdev-backend-2e1ad2316dae.herokuapp.com/food/menu/${food_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert(`Food item with ID ${food_id} updated successfully`);
        const updatedFood = response.data;
        onEdit(updatedFood); // Update local state or trigger reload
      }
    } catch (error) {
      // Display the specific error message from the backend
      console.error("Error updating food item:", error.response.data.error); // Custom message
      alert(`Error: ${error.response.data.error}`); // Show alert to user with the error message
    } finally {
      getCategory();
      getMenu();
      setIsSaving(false); // Reset saving state after request completes
      setEditMode(false); // Exit edit mode after saving
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFoodImageFile(file);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.category_id == categoryId);
    return category ? category.category_name : "Unknown Category";
  };

  return (
    <div className="p-4 rounded-md shadow-lg bg-gradient-to-r from-pink-100 via-green-100 to-blue-100">
      <img
        src={`/${food_image}`}
        alt={food_name}
        className="w-full h-32 object-cover mb-4 border-black border-2 rounded-md"
        key={food_image} // Force re-render when image changes
      />
      {/* if editing */}
      {editMode ? (
        <div className="mb-4">
      
          <input
            type="text"
            value={editFoodName}
            onChange={(e) => setEditFoodName((e.target.value).trim())}
            className="w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <textarea
            value={editFoodDescription}
            onChange={(e) => setEditFoodDescription(e.target.value)}
            rows="3"
            className="w-full mt-2 px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <select
            value={editFoodCategory}
            onChange={(e) => setEditFoodCategory(e.target.value)}
            className="w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500">
            <option value="" disabled hidden>
              Select Category
            </option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="w-full mt-2 px-2 py-1  rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
      ) : (
        // not editing
        <>
          <h2 className="text-lg font-semibold">{food_name}</h2>
          <p className="text-gray-600 italic">{food_description}</p>
          <p className="text-black font-medium">
            Category : {getCategoryName(category_id)}
          </p>
        </>
      )}
      <div className="mt-4 flex justify-end gap-1">
        {editMode ? (
          <>
            <button
              className="bg-red-500 hover:bg-red-900 text-white py-2 px-4 rounded-md"
              onClick={() => setEditMode(false)}>
              Cancel
            </button>
            <button
              className={`bg-blue-500 hover:bg-blue-900 text-white py-2 px-4 rounded-md mr-2 ${
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
              className="bg-red-500 hover:border-2 border-black text-white py-2 px-4 rounded-md mr-2 ">
              Delete
            </button>
            <button
              onClick={handleEdit}
              className="bg-green-500 hover:border-2 border-black text-white py-2 px-4 rounded-md">
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FoodItem;
