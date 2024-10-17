import React, { useEffect, useState} from 'react';
import './RegisterUser.css';
import CustomToast from '../toastMessage/CustomToast';
import {jwtDecode} from 'jwt-decode';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ListUsers from '../listUsers/ListUsers';
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
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
            if (token === null && jwtDecode(token).exp*1000 <  Date.now()) { // && jwtDecode(token).exp*1000 >  Date.now()
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
            <div className="content">
                <div className="col-md-4 register-container row justify-content-center  d-flex " >
                    <div className='formu'>
                        <h2>Registro de Usuario</h2>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col xs={12} sm={6}>
                                    <div className="floating-label">
                                        <Form.Group controlId="name" className='nameUser'>
                                            {/* <Form.Label>Name</Form.Label> */}
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder=""
                                                required
                                                pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                                                maxLength={30}
                                                onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un nombre valido. No se permiten caracteres especiales ni números.')}
                                                onInput={(e) => e.target.setCustomValidity('')}
                                            />
                                            <Form.Label>Nombres</Form.Label>
                                        </Form.Group>
                                    </div>
                                </Col>

                                <Col xs={12} sm={6}>
                                    <div className="floating-label">
                                        <Form.Group controlId="lastName" className='lastNameUser' >
                                            {/* <Form.Label>Last Name</Form.Label> */}
                                            <Form.Control
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                placeholder=""
                                                required
                                                pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                                                maxLength={30}
                                                onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un apellido valido. No se permiten caracteres especiales ni números.')}
                                                onInput={(e) => e.target.setCustomValidity('')}

                                            />
                                            <Form.Label>Apellidos</Form.Label>
                                        </Form.Group>
                                    </div>
                                </Col>
                            </Row>
                            <Form.Group controlId="typeIdentification" className="typeIdentification">
                                {/* <Form.Label>Type of Identification</Form.Label> */}
                                <div className="icon-container">
                                    <Form.Control
                                        as="select"
                                        name="typeIdentification"
                                        value={formData.typeIdentification}
                                        onChange={handleInputChange}
                                        required
                                        style={{ border: 'none' }}
                                    >
                                        <option value="" disabled>Tipo de identificación</option> {/* Opción predeterminada */}
                                        <option value="CC">CC</option>
                                        <option value="CE">CE</option>
                                        <option value="PA">PA</option>
                                    </Form.Control>
                                    <FontAwesomeIcon icon={faChevronDown} className="icon" />
                                </div>
                            </Form.Group>

                            <div className="floating-label">
                                <Form.Group controlId="numberIdentification" className="numberIdentification">
                                    {/* <Form.Label>Number Identification</Form.Label> */}
                                    <Form.Control
                                        type="text"
                                        name="numberIdentification"
                                        value={formData.numberIdentification}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                        maxLength={20}
                                    />
                                    <Form.Label>Número de identificación</Form.Label>
                                </Form.Group>
                            </div>

                            <div className="floating-label">
                                <Form.Group controlId="email" className="email" style={{ outline: '0px' }} >
                                    {/* <Form.Label>Email</Form.Label> */}
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                        maxLength={70}
                                    />
                                    <Form.Label>Correo electrónico</Form.Label>
                                </Form.Group>
                            </div>

                            <div className="floating-label">
                                <Form.Group controlId="phoneNumber" className="phoneNumber">
                                    {/* <Form.Label>Phone Number</Form.Label> */}
                                    <Form.Control
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                        pattern="^[0-9]{10}$"
                                        inputMode="numeric"
                                        maxLength={10}
                                        onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un número de teléfono válido.')}
                                        onInput={(e) => e.target.setCustomValidity('')}
                                    />
                                    <Form.Label>Número de teléfono</Form.Label>
                                </Form.Group>
                            </div>

                            <div className="floating-label">
                                <Form.Group controlId="address" className="address">
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        required
                                        maxLength={50}
                                    />
                                    <Form.Label>Dirección</Form.Label>
                                </Form.Group>
                            </div>

                            <Form.Group controlId="roles" className="roles">

                                <div className="icon-container">
                                    <Form.Control
                                        as="select"
                                        name="roles"
                                        value={formData.roles[0] || ''}  // Usamos el primer valor del arreglo (o cadena vacía si no hay nada)
                                        onChange={(e) => {
                                            const selectedRole = e.target.value;
                                            setFormData({
                                                ...formData,
                                                roles: selectedRole ? [selectedRole] : []  // Solo guardamos un rol en el arreglo
                                            });
                                        }}
                                        required
                                        style={{ border: 'none' }}
                                    >
                                        <option value="" disabled>Selecione un rol</option>
                                        <option value="ADMIN">Administrador</option>
                                        <option value="INTERNAL_TECHNICIAN">Tecnico interno</option>
                                        <option value="EXTERNAL_TECHNICIAN">Tecnico externo</option>
                                    </Form.Control>
                                    <FontAwesomeIcon icon={faChevronDown} className="icon" />
                                </div>
                            </Form.Group>
                            <div className="button-group">
                                <Button variant="primary" type="submit" className='button-register' disabled={loading} onClick={handleRegister} >
                                    Registrar Usuario
                                </Button>
                                <Button variant="secondary" className='button-no-register' disabled={loading} onClick={handleCancel} >
                                    Cancelar Registro
                                </Button>
                            </div>
                        </Form>
                        <ConfirmationModal
                            show={showModal}
                            onHide={handleCloseModal}
                            onConfirm={handleConfirmAction}
                            title={modalType === 'cancel' ? "Cancelar registro" : "Confirmar registro"}
                            bodyText={modalType === 'cancel'
                                ? "¿Estás seguro de que deseas cancelar el registro? Se perderán todos los datos."
                                : "¿Estás seguro de que deseas registrar este usuario?"}
                            confirmText={modalType === 'cancel' ? "Sí, cancelar" : "Sí, registrar"}
                            cancelText="No"
                            containerId="modal-container"
                        />
                    </div>
                    {loading && (
                        <div className="loading-overlay">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </Spinner>
                        </div>
                    )}

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