import React, { useState } from "react";
import axios from "axios";
import { backend_api } from "../../../../../../backend_api";

function Table_add() {
  const [isAdd, setIsAdd] = useState(false);
  const [tableInput, setTableInput] = useState("");

  // Toggle the modal visibility
  const toggleModal = (e) => {
    e.stopPropagation();
    setIsAdd(!isAdd);
  };

  // Close the modal when clicking outside the form
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      toggleModal(e);
    }
  };

  async function submitAddTable(e) {
    e.preventDefault();
    if (!tableInput) {
      alert("Please insert table number.");
      return;
    }
    try {
      const response = await axios.post(`${backend_api}/tables/table`, {
        tableInput,
      });
      if (response.status === 201) {
        alert(response.data.message);
        setTableInput(""); // Clear the input field after successful submission
        toggleModal(e); // Close the modal
      }
    } catch (error) {
      alert("This table value already exists or there was an error.");
    }
  }

  return (
    <div className="my-3">
      <div className="w-full">
        <button className="rounded-md p-3 bg-amber-400 hover:bg-amber-800 shadow-lg" onClick={toggleModal}>
          Add table
        </button>
      </div>

      {isAdd && (
        <div
          className="z-20 overflow-auto fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
          onClick={handleOverlayClick}>
          <div className="bg-gradient-to-r from-blue-100 to-green-200 to p-6 rounded-md shadow-md relative">
            <button
              className="absolute top-2 right-3 text-black hover:text-red-500"
              onClick={toggleModal}>
              &times;
            </button>
            <form onSubmit={submitAddTable}>
              <label htmlFor="table-input" className="block mb-2 text-black">
                Table :
              </label>
              <input
                type="text"
                id="table-input"
                value={tableInput}
                onChange={(e) => setTableInput(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full mb-4"
                placeholder="ใส่หมายเลขโต๊ะที่ต้องการ"
              />
              <button type="submit" className="btn btn-accent">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table_add;
