import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { backend_api } from "../../../backend_api";


function Customer_protect({ children }) {
  const { time, id } = useParams();
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate(); // Move this inside the functional component

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get(
          `${backend_api}/tables/table/${time}/${id}`
        );
        console.log(response.data);
        
        if (response.data.len == 1) {
          setIsValid(true);
        } else {
          alert("ไม่พบผู้ใช้งาน");
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while fetching data.");
      }
    };
    fetchTableData();
  }, [time, id]);

  // useEffect(() => {
  //   if (isValid == false) {
  //     alert("ไม่พบผู้ใช้งาน");
  //     navigate("/"); // Navigate to the main page if not valid
  //   }
  // }, [isValid]);

  return isValid ? children : null; // Render children only if valid
}

export default Customer_protect;
