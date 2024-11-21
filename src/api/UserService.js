import axios from 'axios';

export const getUserById = async (userId, token) => {
    try {
        // Asegúrate de pasar el token como un objeto de configuración
        const response = await axios.get(`/users/findUserById/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Asegúrate de que el token esté en los headers
            }
        });
        return response.data; // Retorna los datos del usuario
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        throw error; // Lanza el error para manejarlo en la función que llama a esta
    }
};

export const getUsersWithoutAdminRole = async (token) => {
    try {
        const response = await axios.get('/users/findUsersWithoutAdminRole',  {
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
