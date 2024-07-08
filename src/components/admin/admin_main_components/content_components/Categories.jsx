import axios from "axios";
import React, { useEffect, useState } from "react";

function Category_item({ category_id, category_name, get_categories }) {
  const [editCategoryName, setEditCategoryName] = useState(category_name); // Initialize with category_name
  const [edit, setEdit] = useState(false);

  async function submit_edit_category(id) {
    try {
      const data = { category_id, category_name: editCategoryName };

      const sendData = await axios.post(
        "http://localhost:3000/admin/categories",
        data
      );

      var result = confirm(`Change ${category_name} to ${editCategoryName} ?`);
      if (result) {
        if (sendData.status == 200) {
          alert(`Submitting edit ${category_name} to  ${editCategoryName}`);
        }
      } else {
        setEdit(false);
        setEditCategoryName(category_name);
        return;
      }

      get_categories();
    } catch (error) {
      alert(error);
    }

    setEdit(false);
    // get new data
  }

  function handleEditToggle() {
    if (edit) {
      // If edit mode is being turned off, reset the input to the original category name
      setEditCategoryName(category_name);
    }
    setEdit(!edit);
  }

  return (
    <div className="flex md:flex-row flex-col gap-2 items-center mt-4">
      <div>
        <p>{category_id}</p>
      </div>
      <div>
        {!edit ? (
          <p>{category_name}</p>
        ) : (
          <input
            type="text"
            value={editCategoryName}
            className="w-full"
            onChange={(e) => setEditCategoryName(e.target.value)}
          />
        )}
      </div>
      <div className="flex gap-2 flex-wrap items-center justify-center">
        <button className="btn btn-error">Delete</button>
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
    </div>
  );
}

function Categories() {
  const [categories, setCategories] = useState([]);

  async function get_categories() {
    try {
      const response = await axios.get(
        "http://localhost:3000/admin/categories"
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
        {categories.map((category) => (
          <Category_item {...category} get_categories={get_categories} />
        ))}
      </div>
    </section>
  );
}

export default Categories;
