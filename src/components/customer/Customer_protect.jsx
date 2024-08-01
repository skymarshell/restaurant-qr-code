import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
function Customer_protect({ children }) {
  const { time, id } = useParams();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/tables/table/${time}/${id}`
        );
        if (response.data === 1) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while fetching data.");
      }
    };
    fetchTableData();
  }, [time, id]);

  return isValid == true ? (
    children
  ) : (
    <p>
      Not found table id: {id} with start time:{time}
    </p>
  );
}

export default Customer_protect;
