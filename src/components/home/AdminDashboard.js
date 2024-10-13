import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendarDays, faHome, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Nav } from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';
import logo from "../../assets/logo.png";
import adminLogo from "../../assets/admin.png";
import './AdminDashboard.css';
import axios from 'axios';
import ListUsers from "../listUsers/ListUsers"; // Asegúrate de que la ruta sea correcta

function AdminDashboard() {
    const [userData, setUserData] = useState({ name: '', lastName: '', email: '' });
    const [logout, setLogout] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);

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
            const response = await axios.get(`${process.env.REACT_APP_BCKEND}/users/logout`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Si necesitas enviar el token de autenticación
              }
            });
            console.log('Logout successful:', response.data);
            // Aquí puedes manejar la redirección o limpieza del estado después del logout
            localStorage.removeItem('authToken'); // Eliminar el token de localStorage
            window.location.href = '/login'; // Redirigir a la página de login
          } catch (error) {
            console.error('Error during logout:', error);
          }
        };
    
        if (logout) {
          handleLogout();
        }
      }, [logout]);

    return (
        <div className="container-fluid" style={{ height: '100vh' }}>
            <div className="row h-100">
                <div className="col-auto col-lg-3 border-end p-0 menu">
                    <div className="profile-header d-flex align-items-center">
                        <img src={logo} alt="Profile" className="profile-img" />
                        <div className="title-profile">
                            <h5 className="profile-title">P&A Aires Acondicionados</h5>
                            <p className="profile-subtitle">Control de mantenimietos</p>
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
                                Configuracion
                            </Nav.Link>
                            <Nav.Link className="nav-item" href="#" onClick={() => setLogout(true)}>
                                <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: '10px' }} />
                                Cerrar Sesión
                            </Nav.Link>
                        </Nav>
                    </div>
                </div>
                <div className="col-lg-9">
                    {selectedComponent === 'Usuarios' && <ListUsers />}
                    {/* Aquí puedes agregar más condiciones para otros componentes */}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;