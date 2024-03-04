import React, { useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = React.createContext();

const AuthContextProvider = (props) => {
  const [activeUser, setActiveUser] = useState({});
  const [config, setConfig] = useState({
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  useEffect(() => {
    const controlAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const { data } = await axios.get(
            "https://blog2-backend-api.onrender.com/auth/private",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setActiveUser(data.user);
        } else {
          throw new Error("No auth token found");
        }
      } catch (error) {
        console.error("Authentication error:", error.message);
        localStorage.removeItem("authToken");
        setActiveUser({});
      }
    };
    controlAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ activeUser, setActiveUser, config, setConfig }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
