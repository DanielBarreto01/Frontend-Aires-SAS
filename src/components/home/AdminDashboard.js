import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendarDays, faHome } from '@fortawesome/free-solid-svg-icons';
import { Nav } from 'react-bootstrap';
import logo from "../../assets/logo.png"
import './AdminDashboard.css';

function AdminDashboard() {
    return (
        <div className="container-fluid" style={{ height: '100vh' }}>
            <div className="row h-100">
                <div className="col-auto col-lg-3 border-end p-0 menu" style={{ height: '100vh', width: '250px' }}>
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
                    <div className="profile-header d-flex align-items-center">
                        <img src={logo} alt="Profile" className="profile-img" />
                        <div className="title-profile">
                            <h5 className="profile-title">"nombre init"</h5>
                            <p className="profile-subtitle">"correo o us"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;