import axios from "axios";
import React, { useEffect, useState } from "react";

function CategoryItem({ category_id, category_name, get_categories, index }) {
  const [editCategoryName, setEditCategoryName] = useState(category_name);
  const [edit, setEdit] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const originalName = category_name;
  async function submitEditCategory(id) {
    try {
      const data = { category_id, category_name: editCategoryName };

      if (!isChanged || editCategoryName == originalName) {
        setEdit(false);
        return;
      }
      if (editCategoryName == "") {
        alert("Please insert category");
        return;
      }

      const sendData = await axios.post(
        "http://localhost:3000/category/update",
        data
      );

      const result = window.confirm(
        `Change ${category_name} to ${editCategoryName} ?`
      );
      if (result) {
        if (sendData.status !== 200) {
          setEditCategoryName(category_name);
          return;
        }
      }
    } catch (error) {
      setEditCategoryName(category_name);
      alert(error.response.data.error);
    }
    setEdit(false);
    setIsChanged(false);
    // get new data
    get_categories();
  }

  async function deleteCategory(category_id, category_name) {
    try {
      if (window.confirm(`Delete ${category_name} ? `)) {
        const deleteCategory = await axios.delete(
          `http://localhost:3000/category/delete/${category_id}/${category_name}`
        );

        if (deleteCategory.status === 200) {
          alert(deleteCategory.data.message);
        }
      } else {
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setEditCategoryName("");
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
    <li className="flex md:flex-row flex-col gap-2 items-center mt-4">
      <div className="w-12">
        <p className="text-center">{index + 1}</p>
      </div>
      <div className="flex-grow">
        {!edit ? (
          <p>{category_name}</p>
        ) : (
          <input
            type="text"
            value={editCategoryName}
            className="w-full px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            onChange={(e) => {
              setEditCategoryName(e.target.value);
              setIsChanged(true);
            }}
          />
        )}
      </div>
      <div className="flex gap-2 items-center">
        <button
          className="btn btn-error"
          onClick={() => deleteCategory(category_id, category_name)}>
          Delete
        </button>
        <button
          className="btn btn-active btn-accent"
          onClick={handleEditToggle}>
          {!edit ? "Edit" : "Cancel"}
        </button>
        {edit && (
          <button
            className="btn btn-primary"
            onClick={() => submitEditCategory(category_id)}>
            Submit
          </button>
        )}
      </div>
    </li>
  );
}

function AddCategory({ categories, get_categories }) {
  const [value, setValue] = useState("");
  const [isError, setIsError] = useState(false);

  async function insertCategory() {
    const insert_value = value.trim();

    try {
      const insert = await axios.post("http://localhost:3000/category/insert", {
        category_name: insert_value,
      });

      if (insert.status === 200) {
        alert(`Inserted ${insert_value} successfully`);
      }

      setValue("");
    } catch (error) {
      alert(error);
    }

    get_categories();
  }

  function handleOnChange(e) {
    const inputValue = e.target.value;
    setValue(inputValue);

    setIsError(categories.find((c) => c.category_name === inputValue));
  }

  return (
    <div className="max-w-screen-2xl p-3 mx-auto mt-11">
      <p className="text-center text-2xl font-bold">Add Category</p>
      <div className="p-3 py-10 md:max-w-screen-md w-full card card-compact bg-base-100 shadow-xl mx-auto">
        <div className="flex items-center justify-center gap-2">
          <p>Category Name</p>
          <input
            type="text"
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            onChange={handleOnChange}
            value={value}
          />
        </div>
        <div className="card-body">
          {isError && (
            <div className="text-red-500 text-center">
              *Category is duplicate!!*
              <br />
              {`${value} already exists`}
            </div>
          )}
          <div className="card-actions justify-center">
            <button
              className={`btn btn-primary`}
              disabled={isError || !value}
              onClick={insertCategory}>
              Insert Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Categories() {
  const [categories, setCategories] = useState([]);

  async function getCategories() {
    try {
      const response = await axios.get(
        "http://localhost:3000/category/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <section>
      <p className="text-center text-2xl font-bold mt-8 mb-4">
        Current Categories
      </p>
      <div className="max-w-screen-2xl mx-auto">
        <ul>
          {categories.map((category, index) => (
            <CategoryItem
              key={index}
              {...category}
              index={index}
              get_categories={getCategories}
            />
          ))}
        </ul>
      </div>
      <div>
        <AddCategory categories={categories} get_categories={getCategories} />
      </div>
    </section>
  );
}

export default Categories;
