import axios from 'axios';

export const getClients = async (token) => {
    try {
        // Asegúrate de pasar el token como un objeto de configuración
        const response = await axios.get("/clients/getClients", {
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