import axios from 'axios';


export const createClientNatural = async (data, token) => {
    try {
        const response = await axios.post('/clients/create/natural-person', data, {
            headers: {
                'Authorization': `Bearer ${token}` // Asegúrate de que el token esté en los headers
            }
        });
        return response; // Retorna los datos del usuario
    } catch (error) {
        console.error("Error al obtener los equipos:", error);
       throw error; // Lanza el error para manejarlo en la función que llama a esta
    }
};

export const createClientJuridical = async (data, token) => {
    try {
        const response = await axios.post('/clients/create/Juridical-person', data, {
            headers: {
                'Authorization': `Bearer ${token}` // Asegúrate de que el token esté en los headers
            }
        });
        return response; // Retorna los datos del usuario
    } catch (error) {
        console.error("Error al obtener los equipos:", error);
       throw error; // Lanza el error para manejarlo en la función que llama a esta
    }
};

export const getClients = async (token) => {
    try {
        // Asegúrate de pasar el token como un objeto de configuración
        const response = await axios.get("/clients/getClients", {
            headers: {
                'Authorization': `Bearer ${token}` // Asegúrate de que el token esté en los headers
            }
        });

        return response.data; // Retorna los datos del usuario
    } catch (error) {
        console.error("Error al obtener los equipos:", error);
        throw error; // Lanza el error para manejarlo en la función que llama a esta
    }
};


export const getClientsActive = async (token) => {
    try {
        // Asegúrate de pasar el token como un objeto de configuración
        const response = await axios.get("/clients/getClientsActive", {
            headers: {
                'Authorization': `Bearer ${token}` // Asegúrate de que el token esté en los headers
            }
        });

        return response.data; // Retorna los datos del usuario
    } catch (error) {
        console.error("Error al obtener los equipos:", error);
        throw error; // Lanza el error para manejarlo en la función que llama a esta
    }
};


export const updateClient = async (clientId, data, token) => {
    try {
        const response = await axios.patch(`/clients/update/${clientId}`, data, {
            headers: {
                'Authorization': `Bearer ${token}` // Asegúrate de que el token esté en los headers
            }
        });
        return response; // Retorna los datos del
    } catch (error) {
        console.error("Error al obtener los equipos:", error);
        throw error; // Lanza el error para manejarlo en la función que llama a esta
    }
};