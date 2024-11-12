import axios from 'axios';

export const getEquipments = async (token) => {
    try {
        const response = await axios.get("/equipments/getEquipments", {
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

export const updateEquipments = async (id, data, token) => {
    try {
        const response = await axios.patch(`/equipments/update/${id}`, data, {
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


export const createEquipments = async (userId, data, token) => {
    try {
        console.log("data",data);
        const response = await axios.post(`/equipments/create/${userId}`, data, {
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

export const getEquipmentsIdClient = async (clientId, token) => {
    try {
        const response = await axios.get(`/equipments/getEquipmentsByIdClient/${clientId}`, {
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