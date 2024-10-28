import axios from 'axios';

export const getUserById = async (userId, token) => {
    try {
        // Asegúrate de pasar el token como un objeto de configuración
        const response = await axios.get(`/users/findUserById/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Asegúrate de que el token esté en los headers
            }
        });

        // Imprimir la respuesta completa en la consola
        console.log("Respuesta del servidor:", response.data);

        return response.data; // Retorna los datos del usuario
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        throw error; // Lanza el error para manejarlo en la función que llama a esta
    }
};
