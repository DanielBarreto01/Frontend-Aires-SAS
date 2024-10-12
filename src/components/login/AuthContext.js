import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const handleLogin = async (userName, password) => {
    const response = await axios.post(`${process.env.REACT_APP_BCKEND}/login`, {userName, password }, {
        headers :{
            'Content-Type': 'application/json',
            'Accept': '*/*'
        }
    });
    return response.data.token;
    };
    return (
        <AuthContext.Provider value={{ authToken, handleLogin }}>
          {children}
        </AuthContext.Provider>
      );
};