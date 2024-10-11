import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendarDays, faHome } from '@fortawesome/free-solid-svg-icons';
import { Nav } from 'react-bootstrap';
import './AdminDashboard.css';

function AdminDashboard() {
    return (
        <div className="container-fluid" style={{ height: '100vh' }}>
            <div className="row h-100">
                <div className="col-auto col-lg-3 border-end p-0 menu" style={{ height: '100vh', width: '250px' }}>
                    <div className="d-flex flex-column h-100 gap-2">
                        <div className="profile-header">
                            <img src="https://via.placeholder.com/80" alt="Profile" className="profile-img" />
                            <h5 className="mt-2 profile-title">P&A Aires Acondicionado</h5>
                            <p className="profile-subtitle">Control de mantenimietos</p>
                        </div>
                        <div className="flex-grow-1 py-2">
                            <Nav className="flex-column">
                                <Nav.Link className="nav-item" href="#">
                                    <FontAwesomeIcon icon={faHome} style={{ marginRight: '10px' }} />
                                    Home
                                </Nav.Link>
                                <Nav.Link className="nav-item" href="#">
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;