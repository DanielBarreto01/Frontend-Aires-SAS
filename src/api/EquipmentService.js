import axios from 'axios';

export const getEquipments = async (token) => {
    try {
        // Asegúrate de pasar el token como un objeto de configuración
        const response = await axios.get("/equipments/getEquipments", {
            headers: {
                'Authorization': `Bearer ${token}` // Asegúrate de que el token esté en los headers
            }
        });

        // Imprimir la respuesta completa en la consola
        console.log("Respuesta del servidor:", response.data);
        console.log("Respuesta del servidor 2edd    :", response);

        return response.data; // Retorna los datos del usuario
    } catch (error) {
        console.error("Error al obtener los equipos:", error);
        throw error; // Lanza el error para manejarlo en la función que llama a esta
    }
};

export const updateEquipments = async (id, data, token) => {
    try {
        // Asegúrate de pasar el token como un objeto de configuración
        console.log("data",data);
        const response = await axios.patch(`/equipments/update/${id}`, data, {
            headers: {
                'Authorization': `Bearer ${token}` // Asegúrate de que el token esté en los headers
            }
        });

        // Imprimir la respuesta completa en la consola
        console.log("Respuesta del servidor:", response.data);

        return response; // Retorna los datos del usuario
    } catch (error) {
        console.error("Error al obtener los equipos:", error);
        throw error; // Lanza el error para manejarlo en la función que llama a esta
    }
};


export const createEquipments = async (userId, data, token) => {
    try {
        // Asegúrate de pasar el token como un objeto de configuración
        console.log("data",data);
        const response = await axios.post(`/equipments/create/${userId}`, data, {
            headers: {
                'Authorization': `Bearer ${token}` // Asegúrate de que el token esté en los headers
            }
        });

        // Imprimir la respuesta completa en la consola
        console.log("Respuesta del servidor:", response.data);

        return response; // Retorna los datos del usuario
    } catch (error) {
        console.error("Error al obtener los equipos:", error);
       throw error; // Lanza el error para manejarlo en la función que llama a esta
    }
};