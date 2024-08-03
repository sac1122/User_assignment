import { useState } from "react";
import axios from "axios";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;


const useUserData = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState([]);

  const fetchUserList = async () => {
    console.log('process',API_HOST);
    setIsLoading(true)
    try {
      const response = await axios.get(`${API_HOST}`);
      setUserList(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setIsLoading(false);
    }
  };


  return {
    fetchUserList,
    userList,
    isLoading,

  };
};

export default useUserData;
