import axios from 'axios';


export const createRequestMaintenace = async (data, token) => {
    try {
        const response = await axios.post('/maintenanceRequest/create', data, {
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

export const getRequestMaintenace = async (token) => {
    try {
        const response = await axios.get('/maintenanceRequest/getMaintenanceRequests',  {
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

export const updateRequestMaintenace = async (requestMaintenaceId, data, token) => {
    try {
        const response = await axios.patch(`/maintenanceRequest/updateMaintenanceRequest/${requestMaintenaceId}`, data, {
            headers: {
                'Authorization': `Bearer ${token}` // Asegúrate de que el token esté en los headers
            }
        });
        return response; // Retorna los datos del usuario
    } catch (error) {
        console.error("Error al obtener los equipos:", error);
        throw error; // Lanza el error para manejarlo en la función que llama a esta
    }
}