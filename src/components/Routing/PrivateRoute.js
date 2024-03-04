import React, { useEffect, useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Home from '../GeneralScreens/Home';
import axios from 'axios';
import { AuthContext } from "../../Context/AuthContext";

const PrivateRoute = () => {
    const [auth, setAuth] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setActiveUser, setConfig } = useContext(AuthContext);

    useEffect(() => {
        const controlAuth = async () => {
            const authToken = localStorage.getItem("authToken");
            if (authToken) {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                };
                try {
                    const { data } = await axios.get("https://blog2-backend-api.onrender.com/auth/private", config);
                    setAuth(true);
                    setActiveUser(data.user);
                    setConfig(config);
                } catch (error) {
                    console.error("Authentication error:", error.message);
                    localStorage.removeItem("authToken");
                    setAuth(false);
                    setActiveUser({});
                    setError("You are not authorized. Please login.");
                    navigate("/");
                }
            } else {
                setAuth(false);
                setActiveUser({});
                setError("You are not authorized. Please login.");
                navigate("/");
            }
        };
        controlAuth();
    }, [navigate, setActiveUser, setConfig]);

    return auth ? <Outlet /> : <Home error={error} />;
}

export default PrivateRoute;
