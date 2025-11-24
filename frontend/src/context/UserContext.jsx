import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios';

export const userDataContext = createContext();

function UserContext({children}) {
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const serverUrl = "http://localhost:8000";

  // Function to fetch current user data
const handleCurrentUser = async () => {
  try {
    const result = await axios.get(`${serverUrl}/api/user/current`,
      { withCredentials: true });
      setUserData(result.data);
      console.log("Current User Data:", result.data);
  } catch (error) {
    console.error("Error fetching current user data:", error);
  }
}

// get gemini response
const getGeminiResponse = async (command) => {
  try {
    const result = await axios.post(`${serverUrl}/api/user/asktoassistant`,
      {command}, 
      {withCredentials:true}
    )
    return result.data
  } catch (error) {
    console.log(error)
  }
}

// Fetch current user data on component mount
useEffect(() => {
  handleCurrentUser();
}, []);

// Context value to be provided to consuming components
const value  = {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
}

  return (
    <div>
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    </div>
  )
}

export default UserContext
