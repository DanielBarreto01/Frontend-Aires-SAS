import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendarDays, faHome, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Nav, Spinner } from 'react-bootstrap';  // Asegúrate de que el Spinner esté importado
import {jwtDecode} from 'jwt-decode';
import logo from "../../assets/logo.png";
import adminLogo from "../../assets/admin.png";
import './AdminDashboard.css';
import axios from 'axios';
import ListUsers from "../listUsers/ListUsers";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

function AdminDashboard() {
    const [userData, setUserData] = useState({ name: '', lastName: '', email: '' });
    const [logout, setLogout] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loading, setLoading] = useState(false);  // Estado de carga

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserData({
                name: decodedToken.name,
                lastName: decodedToken.lastName,
                email: decodedToken.email
            });
        }
    }, []);

    useEffect(() => {
        const handleLogout = async () => {
            try {
                setLoading(true);  // Mostrar el spinner
                const response = await axios.get(`${process.env.REACT_APP_BCKEND}/users/logout`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Si necesitas enviar el token de autenticación
                    }
                });
                console.log('Logout successful:', response.data);
                localStorage.removeItem('authToken');  // Eliminar el token de localStorage
                window.location.href = '/login';  // Redirigir a la página de login
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    console.error('Token vencido:', error);
                    localStorage.removeItem('authToken');  // Eliminar el token de localStorage
                    window.location.href = '/login';  // Redirigir a la página de login
                } else {
                    console.error('Error durante el logout:', error);
                }
            } finally {
                setLoading(false);  // Ocultar el spinner cuando termine
            }
        };

        if (logout) {
            handleLogout();
        }
    }, [logout]);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);  // Mostrar el modal de confirmación
    };

    const handleConfirmLogout = () => {
        setShowLogoutModal(false);  // Ocultar el modal
        setLogout(true);  // Iniciar el proceso de logout
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);  // Ocultar el modal sin hacer logout
    };

    return (
        <div className="container-fluid" style={{ height: '100vh' }}>
            <div className="row h-100">
                <div className="col-auto col-lg-3 border-end p-0 menu">
                    <div className="profile-header d-flex align-items-center">
                        <img src={logo} alt="Profile" className="profile-img" />
                        <div className="title-profile">
                            <h5 className="profile-title">P&A Aires Acondicionados</h5>
                            <p className="profile-subtitle">Control de mantenimientos</p>
                        </div>
                    </div>
                    <div className="d-flex flex-column h-100 gap-2">
                        <div className="flex-grow-1 py-2">
                            <Nav className="flex-column">
                                <Nav.Link className="nav-item" href="#" onClick={() => setSelectedComponent('Home')}>
                                    <FontAwesomeIcon icon={faHome} style={{ marginRight: '10px' }} />
                                    Home
                                </Nav.Link>
                                <Nav.Link className="nav-item" href="#" onClick={() => setSelectedComponent('Usuarios')}>
                                    <FontAwesomeIcon icon={faUsers} style={{ marginRight: '10px' }} />
                                    Usuarios
                                </Nav.Link>
                                <Nav.Link className="nav-item" href="#">
                                    <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: '10px' }} />
                                    Equipos
                                </Nav.Link>
                                <Nav.Link className="nav-item" href="#">
                                    <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: '10px' }} />
                                    Clientes
                                </Nav.Link>
                                <Nav.Link className="nav-item" href="#">
                                    <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: '10px' }} />
                                    Mantenimientos
                                </Nav.Link>
                                <Nav.Link className="nav-item" href="#">
                                    <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: '10px' }} />
                                    Control Mantenimientos
                                </Nav.Link>
                            </Nav>
                        </div>
                        <div className="profile-header-user d-flex align-items-center">
                            <img src={adminLogo} alt="Admin" className="profile-img-user" />
                            <div className="title-profile">
                                <h5 className="profile-title-user">{userData.name} {userData.lastName}</h5>
                                <p className="profile-subtitle-user">{userData.email}</p>
                            </div>
                        </div>
                        <Nav className="flex-column">
                            <Nav.Link className="nav-item" href="#">
                                <FontAwesomeIcon icon={faGear} style={{ marginRight: '10px' }} />
                                Configuración
                            </Nav.Link>
                            <Nav.Link className="nav-item" href="#" onClick={handleLogoutClick}>
                                <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: '10px' }} />
                                Cerrar Sesión
                            </Nav.Link>
                        </Nav>
                    </div>
                </div>
                <div className="col-lg-9">
                    {selectedComponent === 'Usuarios' && <ListUsers />}
                </div>

                {/* Modal de confirmación de cierre de sesión */}
                <ConfirmationModal
                    show={showLogoutModal}
                    onHide={handleCancelLogout}
                    onConfirm={handleConfirmLogout}
                    title="Cierre de Sesión"
                    bodyText="¿Estás seguro de que deseas cerrar sesión?"
                    confirmText={loading ? <Spinner animation="border" size="sm" /> : "Sí"} // Mostrar spinner si está cargando
                    cancelText="No"
                />

                {/* Spinner global que se muestra mientras el logout está en proceso */}
                {loading && (
                    <div className="loading-overlay">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </Spinner>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
