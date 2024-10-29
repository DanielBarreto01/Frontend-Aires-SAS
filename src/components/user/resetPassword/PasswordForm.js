import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import './PasswordForm.css'; // Asegúrate de importar el archivo CSS
import { useLocation} from 'react-router-dom';
import CustomToast from '../../toastMessage/CustomToast';
import axios from 'axios';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import { useNavigate, Outlet } from 'react-router-dom';

const PasswordForm = () => {
    const location = useLocation();
    const requestToken = new URLSearchParams(location.search).get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);     // Estado para mostrar/ocultar el Toast
    const [toastMessage, setToastMessage] = useState('');  // Estado para el mensaje del Toast
    const [toastType, setToastType] = useState('');
    const [loading, setLoading] = useState(true);
    const [verificationCode, setVerificationCode] = useState('');
    const [disableButton, setDisableButton] = useState(false);
    const [modalType, setModalType] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        try {
            if (!localStorage.getItem('validateToken') || JSON.parse(localStorage.getItem('validateToken')).token !== requestToken) {
                console.log("entra al if token");
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Authorization': ''
                    }
                };
                axios.get(`/reset-password/validateStatusToken/${requestToken}`, config).then((response) => {
                    localStorage.setItem('validateToken', JSON.stringify(response.data));
                    console.log("validacion correcta", requestToken,"hola");
                    setLoading(false);
                }).catch((error) => {
                    console.log(error);
                    console.log("incorrecta");
                    navigate('/login');
                });

            } else if (new Date((JSON.parse(localStorage.getItem('validateToken'))).date) < Date.now() || requestToken === null) {
                console.log("incorrecta sale fecha");
                console.log(requestToken);
                navigate('/login');
            } else {
                console.log("correcta salse else");
                setLoading(false);
            }

        } catch (error) {
            console.log("error acces");
            localStorage.removeItem('validateToken');
            navigate('/login');
        }

    }, [requestToken]);
    

    const handleCancel = () => {
        setModalType('cancel');  // Definimos el tipo de acción como cancelar
        setShowModal(true);      // Mostramos el modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Cerrar el modal sin realizar acción
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el envío del formulario
        // Verificar si las contraseñas coinciden
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (/\s/.test(password)) {
            setError("La contraseña no debe contener espacios en blanco");
            return;
        }
        setModalType('register');
        setShowModal(true);
    };

    const handleConfirmAction = (e) => {
        console.log("Ejecutando handleConfirmAction con modalType:", modalType); // Log del tipo de acción
        setShowModal(false);
        setLoading(true);
    
        if (modalType === 'cancel') {
            console.log("Acción de cancelación seleccionada.");
            navigate('/login');
            setLoading(false);
            navigate('/login');
        } else if (modalType === 'register') {
            console.log("Iniciando proceso de registro de contraseña."); // Log inicial de cambio de contraseña
            setLoading(true);
    
            const body = {
                'password': password,
                'verificationCode': verificationCode
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            };
    
            axios.post(`/reset-password/changePassword/${requestToken}`, body, config)
                .then((response) => {
                    console.log("Contraseña cambiada exitosamente:", response.data); // Log de éxito
                    setError('');
                    setLoading(false);
                    setShowToast(true);
                    setToastMessage(response.data);
                    setDisableButton(true);
                    setToastType('success');
                    localStorage.removeItem('validateToken');
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                })
                .catch((error) => {
                    console.error("Error al cambiar la contraseña:", error.response ? error.response.data : error); // Log del error
                    setLoading(false);
                    setShowToast(true);
                    setToastMessage(error.response ? error.response.data : 'Error al cambiar la contraseña');
                    setToastType('danger');
                    console.log("Contraseña enviada:", password); // Log de contraseña (para pruebas, eliminar en producción)
                    setError(''); // Limpiar el error
                });
        }
    };
    

    //probar este if
    if (loading) {
        return (
            <div className="loading-overlay">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className="container-reset-password">
            <div className="container-formulary">
                <h3>Restablecimiento de Contraseña</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Label>Código de verificación</Form.Label>
                    <Form.Group controlId="code" className="code">
                        <Form.Control
                            type="number"
                            name="verificationCode"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Ingresa el código"
                            required
                            maxLength={6}
                            onInput={(e) => {
                                // Limita el input a 10 dígitos
                                e.target.value = e.target.value.slice(0, 6);
                                e.target.setCustomValidity('');
                                if (e.target.value.length < 6) {
                                    e.target.setCustomValidity('El código es de 6 dígitos.');
                                }
                            }}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Nueva Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            maxLength={20}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formConfirmPassword">
                        <Form.Label>Confirmar Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirme su contraseña"
                            value={confirmPassword}
                            maxLength={20}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {error && <p className="error-message">{error}</p>} {/* Mostrar error si las contraseñas no coinciden */}
                    <div className='button-group'>
                        <Button variant="primary" type="submit" className='button-acept' disabled={disableButton}>
                            Enviar
                        </Button>
                        <Button variant="secondary" type="button" className='button-cancel' disabled={disableButton} onClick={handleCancel} >
                            Salir
                        </Button>
                    </div>

                </Form>
                <ConfirmationModal
                    show={showModal}
                    onHide={handleCloseModal}
                    onConfirm={handleConfirmAction}
                    title={modalType === 'cancel' ? "Cancelar restablecimiento de contraseña" : "Confirmar restablecimiento de contraseña"}
                    bodyText={modalType === 'cancel'
                        ? "¿Estás seguro de que no deseas restablecer la contraseña?"
                        : "¿Estás seguro de que deseas restablecer la contraseña?"}
                    confirmText={modalType === 'cancel' ? "Sí" : "Sí"}
                    cancelText="No"
                    containerId="modal-container"
                />
            </div>
            <CustomToast
                showToast={showToast}
                setShowToast={setShowToast}
                toastMessage={toastMessage}
                toastType={toastType}
            />
        </div>
    );
};

export default PasswordForm;
