import axios from "axios";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { backend_api } from "../../../../../backend_api";
function CategoryItem({ category_id, category_name, get_categories, index }) {
  const [editCategoryName, setEditCategoryName] = useState(category_name);
  const [edit, setEdit] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const originalName = category_name;

  async function submitEditCategory(id) {
    if (!isChanged || editCategoryName === originalName) {
      setEdit(false);
      return;
    }
    if (editCategoryName.trim() === "") {
      alert("Please insert category name");
      return;
    }

    setLoading(true);
    try {
      const data = { category_id, category_name: editCategoryName.trim() };

      const sendData = await axios.post(
        `${backend_api}/category/update`,
        data
      );

      const result = window.confirm(
        `Change "${category_name}" to "${editCategoryName}"?`
      );
      if (result && sendData.status === 200) {
        alert(`Category "${category_name}" updated successfully.`);
      } else {
        setEditCategoryName(category_name);
      }
    } catch (error) {
      setEditCategoryName(category_name);
      alert(error.response.data.error);
    } finally {
      setLoading(false);
      setEdit(false);
      setIsChanged(false);
      get_categories();
    }
  }

  async function deleteCategory(category_id, category_name) {
    if (
      !window.confirm(`Are you sure you want to delete "${category_name}"?`)
    ) {
      return;
    }

    setLoading(true);
    try {
      const deleteCategory = await axios.delete(
        `${backend_api}/category/delete/${category_id}/${category_name}`
      );

      if (deleteCategory.status === 200) {
        alert(`Category "${category_name}" deleted successfully.`);
      }
    } catch (error) {
      alert(error.response.data.error);
    } finally {
      setLoading(false);
      get_categories();
    }
  }

  function handleEditToggle() {
    if (edit) {
      setEditCategoryName(category_name);
    }
    setEdit(!edit);
  }

  return (
    <li className="flex md:flex-row flex-col gap-4 items-center py-3 mt-5 shadow-lg rounded bg-amber-50">
      <div className="w-12 text-center">
        <p className="">{index + 1}</p>
      </div>
      <div className="flex-grow">
        {!edit ? (
          <p className="text-lg">{category_name}</p>
        ) : (
          <input
            type="text"
            value={editCategoryName}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            onChange={(e) => {
              setEditCategoryName(e.target.value);
              setIsChanged(true);
            }}
            disabled={loading}
          />
        )}
      </div>
      <div className="flex gap-2">
        <button
          className="bg-red-500 p-1 rounded shadow-lg px-5 hover:border-2 border-black "
          onClick={() => deleteCategory(category_id, category_name)}
          disabled={loading}>
          Delete
        </button>
        <button
          className="bg-green-500 p-1 rounded shadow-lg mr-2 px-4 hover:border-2 border-black "
          onClick={handleEditToggle}
          disabled={loading}>
          {!edit ? "Edit" : "Cancel"}
        </button>
        {edit && (
          <button
            className="btn btn-primary mr-2 hover:bg-blue-500"
            onClick={() => submitEditCategory(category_id)}
            disabled={!isChanged || loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </li>
  );
}

function AddCategory({ categories, get_categories }) {
  const [value, setValue] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function insertCategory() {
    const insert_value = value.trim();

    if (insert_value === "") {
      alert("Please insert a category name");
      return;
    }

    setLoading(true);
    try {
      const insert = await axios.post(
        `${backend_api}/category/insert`,
        {
          category_name: insert_value,
        }
      );

      if (insert.status === 200) {
        alert(`Category "${insert_value}" added successfully.`);
        setValue("");
      }
    } catch (error) {
      alert(error.response.data.error);
    } finally {
      setLoading(false);
      get_categories();
    }
  }

  function handleOnChange(e) {
    const inputValue = e.target.value;
    setValue(inputValue);

    setIsError(categories.find((c) => c.category_name === inputValue.trim()));
  }

  return (
    <div className="max-w-screen-md p-6 mx-auto mt-8 card card-compact bg-gradient-to-r from-green-200 to-green-100 shadow-xl">
      <p className="text-center text-2xl font-bold mb-4">Add Category</p>
      <div className="flex items-center justify-center gap-2">
        <input
          type="text"
          placeholder="Enter category name"
          className={`w-full px-3 py-2 border ${
            isError ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:border-blue-500`}
          onChange={handleOnChange}
          value={value}
          disabled={loading}
        />
      </div>
      {isError && (
        <div className="text-red-500 text-center mt-2">
          *Category already exists!*
        </div>
      )}
      <div className="mt-4 text-center">
        <button
          className={`btn btn-primary hover:bg-blue-500 ${
            loading ? "loading" : ""
          }`}
          disabled={isError || !value || loading}
          onClick={insertCategory}>
          {loading ? "Inserting..." : "Insert Category"}
        </button>
      </div>
    </div>
  );
}

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getCategories() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backend_api}/category/categories`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <section>
      <div className="max-w-screen-2xl mx-auto">
        {loading ? (
          <p className="text-center">Loading categories...</p>
        ) : (
          <ul>
            {categories.map((category, index) => (
              <CategoryItem
                key={category.category_id}
                {...category}
                index={index}
                get_categories={getCategories}
              />
            ))}
          </ul>
        )}
      </div>
      <AddCategory categories={categories} get_categories={getCategories} />
    </section>
  );
}

export default Categories;
