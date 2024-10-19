import React, { useEffect, useState } from 'react';
import styles from './RegisterUser.css';
import CustomToast from '../../toastMessage/CustomToast';
import RegisterUserForm from './RegisterUserForm';
import { jwtDecode } from 'jwt-decode';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ListUsers from '../listUsers/ListUsers';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import axios from 'axios';

//import { toast } from 'sonner'
function RegisterUser() {
    const [isNewComponentVisible, setIsNewComponentVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);  // Estado para mostrar el modal
    const [modalType, setModalType] = useState('');     // Estado para controlar el tipo de acción (cancelar o registrar)
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);     // Estado para mostrar/ocultar el Toast
    const [toastMessage, setToastMessage] = useState('');  // Estado para el mensaje del Toast
    const [toastType, setToastType] = useState('');
    const [isTokenChecked, setIsTokenChecked] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        typeIdentification: '',
        numberIdentification: '',
        email: '',
        phoneNumber: '',
        address: '',
        roles: []
    });

    useEffect(() => {
        console.log('entra al useeffect');
        setTimeout(() => {
            const token = localStorage.getItem('authToken');
            if (token === null && jwtDecode(token).exp * 1000 < Date.now()) { // && jwtDecode(token).exp*1000 >  Date.now()
                localStorage.removeItem('authToken');
                setIsTokenChecked(false);
                console.log('entra al token ', token);
                window.location.href = '/login';
            }
        }, 200);
        return () => clearTimeout();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'email' ? value.replace(/\s/g, '') : value,
        });
    };

    // const handleButtonClick = () => {
    //     setIsNewComponentVisible(prevState => !prevState);
    // };

    const handleCancel = () => {
        setModalType('cancel');  // Definimos el tipo de acción como cancelar
        setShowModal(true);      // Mostramos el modal
    };
    const handleRegister = () => {
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        setModalType('register');
        setShowModal(true);
    };

    const handleConfirmAction = () => {
        setShowModal(false);  // Cerramos el modal primero
        setLoading(true);
        setTimeout(() => {
            if (modalType === 'cancel') {
                // Acción de cancelar
                setTimeout(() => {
                    setFormData({
                        name: '',
                        lastName: '',
                        typeIdentification: '',
                        numberIdentification: '',
                        email: '',
                        phoneNumber: '',
                        address: '',
                        roles: []
                    });
                    setLoading(false);  // Detenemos el spinner
                    setIsNewComponentVisible(true);  // Mostramos el componente ListUsers
                }, 200); // Simulamos una espera de 2 segundos
            } else if (modalType === 'register') {

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                };
                // Acción de registrar - enviar datos al backend
                console.log('Registrando usuario:', formData);
                axios.post(`${process.env.REACT_APP_BCKEND}/users/create`, formData, config,)
                    .then(response => {
                        setLoading(true)
                        setToastMessage(response.data || 'Usuario registrado con éxito');
                        setToastType('success'); // Tipo de mensaje (éxito)
                        console.log('desactivar botones', loading);
                        setShowToast(true);  // Mostramos el Toast

                        setFormData({
                            name: '',
                            lastName: '',
                            typeIdentification: '',
                            numberIdentification: '',
                            email: '',
                            phoneNumber: '',
                            address: '',
                            roles: [],
                        });
                        setLoading(false);
                        setTimeout(() => {
                            setIsNewComponentVisible(true);  // Mostramos el componente ListUsers

                        }, 3000);  // Cambiar desp// Retardo adicional para que el Toast sea visible (3.5 segundos en este caso)
                        setLoading(true);

                    })
                    .catch(error => {
                        console.error('Error registering user:', error);
                        // Verificar si error.response existe
                        if (!error.response) {
                            // Esto significa que no hubo respuesta del servidor (posiblemente desconectado o problemas de red)
                            setToastMessage('No se puede conectar al servidor. Verifica tu conexión o intenta más tarde.');
                            setToastType('danger');
                        } else {
                            // Si el error tiene respuesta, manejar los errores del backend
                            const errorMessage =
                                error.response.data && error.response.data
                                    ? error.response.data
                                    : 'Error al registrar el usuario. Inténtalo de nuevo.';
                            setToastMessage(errorMessage);  // Mostrar el mensaje de error del backend
                            setToastType('danger');  // Tipo de mensaje (error)
                        }
                        // Mostrar el toast y detener el spinner
                        setShowToast(true);
                        setLoading(false); // Detenemos el spinner si hay un error
                    });
            }
        }, 200); // Retardo de 500 ms para mostrar el spinner después de cerrar el modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Cerrar el modal sin realizar acción
    };


    if (!isTokenChecked) {
        return null;
    }

    return (
        isNewComponentVisible ? (
            <ListUsers />) : (
            <div>
                <div className={`principal ${styles}`}>
                    <div className={"col-md-6 row justify-content-center d-flex"}>
                        <h2>Registro de Usuario</h2>
                        <RegisterUserForm
                            formData={formData}
                            setFormData={setFormData}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                            // handleImageChange={handleImageChange}
                            // selectedImage={selectedImage}
                            loading={loading}
                            handleCancel={handleCancel}
                            handleRegister={handleRegister}
                            showModal={showModal}
                            handleCloseModal={handleCloseModal}
                            handleConfirmAction={handleConfirmAction}
                            modalType={modalType}
                        />
                    </div>
                </div>
                <CustomToast
                    showToast={showToast}
                    setShowToast={setShowToast}
                    toastMessage={toastMessage}
                    toastType={toastType}
                />
            </div>
        )
    );
}

export default RegisterUser;