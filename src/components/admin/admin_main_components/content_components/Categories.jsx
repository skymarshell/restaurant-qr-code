import axios from "axios";
import React, { useEffect, useState } from "react";

function Category_item({ category_id, category_name, get_categories, index }) {
  const [editCategoryName, setEditCategoryName] = useState(category_name); // Initialize with category_name
  const [edit, setEdit] = useState(false);

  async function submit_edit_category(id) {
    try {
      const data = { category_id, category_name: editCategoryName };

      const sendData = await axios.post(
        "http://localhost:3000/category/update",
        data
      );

      const result = confirm(
        `Change ${category_name} to ${editCategoryName} ?`
      );
      if (result) {
        if (sendData.status == 200) {
          alert(`Submitting edit ${category_name} to  ${editCategoryName}`);
        }
      } else {
        setEditCategoryName(category_name);
        return;
      }
    } catch (error) {
      setEditCategoryName(category_name);
      alert(error.response.data.error);
    }

    setEdit(false);
    // get new data
    get_categories();
  }

  async function deleteCategory(category_id, category_name) {
    try {
      if (confirm(`Delete ${category_name} ? `)) {
        const deleteCategory = await axios.delete(
          `http://localhost:3000/category/delete/${category_id}/${category_name}`
        );

        if (deleteCategory.status == 200) {
          alert(deleteCategory.data.message);
        }
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }

    get_categories();
  }

  function handleEditToggle() {
    if (edit) {
      // If edit mode is being turned off, reset the input to the original category name
      setEditCategoryName(category_name);
    }
    setEdit(!edit);
  }

  return (
    <li className="flex md:flex-row flex-col gap-2 items-center mt-4">
      <div>
        <p>{index + 1}</p>
      </div>
      <div>
        {!edit ? (
          <p>{category_name}</p>
        ) : (
          <input
            type="text"
            value={editCategoryName}
            className="w-full ps-2 p-2 rounded-md"
            onChange={(e) => setEditCategoryName(e.target.value)}
          />
        )}
      </div>
      <div className="flex gap-2 flex-wrap items-center justify-center">
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
            onClick={() => submit_edit_category(category_id)}>
            Submit
          </button>
        )}
      </div>
    </li>
  );
}

function Add_item({ categories, get_categories }) {
  const [value, setValue] = useState("");
  const [isError, setIsError] = useState(false);

  async function insert_category() {
    // insert data to db
    const insert_value = value.trim();
    console.log(insert_value);

    try {
      const insert = await axios.post(
        "http://localhost:3000/category/insert",
        {
          category_name: insert_value,
        }
      );

      if (insert.status === 200) {
        alert(`inserted ${insert_value} successfully`);
      }

      setValue("");
    } catch (error) {
      alert(error);
    }

    // get new data
    get_categories();
  }

  function handleOnchange(e) {
    const inputValue = e.target.value;
    setValue(inputValue);

    if (categories.find((c) => c.category_name === inputValue)) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }

  return (
    <div className="max-w-screen-2xl  p-3  mx-auto mt-11">
      <p className="text-center text-2xl font-bold">Add item</p>
      <div className="p-3 py-10 md:max-w-screen-md w-full card card-compact bg-base-100  shadow-xl mx-auto">
        <div>
          <div className="flex items-center justify-center gap-2 ">
            <p className="">Category name</p>
            <input
              type="text"
              className="md:w-96 w-full ps-2 p-1 border-2 border-black rounded-md"
              onChange={handleOnchange}
              value={value}
            />
          </div>
        </div>
        <div className="card-body">
          <h2 className="card-title text-red-500 text-center mx-auto">
            {isError == true ? "*Category is duplicate !!*" : ""}
          </h2>
          <p className="text-red-500 text-center">
            {isError == true ? `${value} already exists` : ""}
          </p>
          <div className="card-actions justify-center">
            <button
              className="btn btn-primary"
              id="insert-btn"
              disabled={isError == true || value == ""}
              onClick={insert_category}>
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

  async function get_categories() {
    try {
      const response = await axios.get(
        "http://localhost:3000/category"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    get_categories();
  }, []);

  return (
    <section>
      <p>Current Categories</p>
      <div>
        <ul>
          {categories.map((category, index) => (
            <Category_item
              key={index}
              {...category}
              index={index}
              get_categories={get_categories}
            />
          ))}
        </ul>
      </div>
      <div>
        <Add_item categories={categories} get_categories={get_categories} />
      </div>
    </section>
  );
}

export default Categories;
