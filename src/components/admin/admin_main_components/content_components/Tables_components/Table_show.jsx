import React from "react";

function Table_show() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 ">
      <div className="border border-white">
        <p>Table number : 1</p>
        <p>Status : unavailable</p>
        <p>Start time : 123456</p>
        <p>Remaining time : 123456</p>
        <p>Number of customers : 4</p>
        <div>
          <p>Delete</p>
          <p>Edit</p>
        </div>
        <div>
          <p>End</p>
          <p>View QR code</p>
          <p>Print</p>
        </div>
      </div>
    </div>
  );
}

export default Table_show;
