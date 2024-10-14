import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);

    const handleLogin = async (userName, password) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BCKEND}/login`, { userName, password }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            });
            return response.data.token; // Retorna el token si la solicitud es exitosa
        } catch (error) {
            // Manejo de errores para que se pueda capturar en Login
            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error('Credenciales incorrectas. Por favor, intenta nuevamente.');
                } else {
                    throw new Error(error.response.data.message || 'Error en la solicitud.'); // Mensaje genérico para otros errores
                }
            } else if (error.request) {
                throw new Error('El servidor no respondió. Por favor, verifica tu conexión.');
            } else {
                throw new Error('Error al realizar la solicitud: ' + error.message);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ authToken, handleLogin }}>
            {children}
        </AuthContext.Provider>
    );
};
