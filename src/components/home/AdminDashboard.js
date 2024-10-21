import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendarDays, faHome, faGear, faRightFromBracket, faHardDrive, faBars, faFileLines, faScrewdriverWrench, faBuildingUser } from '@fortawesome/free-solid-svg-icons';
import { Nav, Spinner, Navbar } from 'react-bootstrap';  // Asegúrate de que el Spinner esté importado
import { jwtDecode } from 'jwt-decode';
import logo from "../../assets/logo.png";
import adminLogo from "../../assets/admin.png";
import './AdminDashboard.css';
import axios from 'axios';
import ListUsers from "../user/listUsers/ListUsers";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

function AdminDashboard() {
  const [userData, setUserData] = useState({ name: '', lastName: '', email: '' });
  const [logout, setLogout] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);  // Estado de carga
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {  // Mostrar el spinner
    const token = localStorage.getItem('authToken');
    if (token !== null && jwtDecode(token).exp*1000 >  Date.now()) { //&& jwtDecode(token).exp*1000 >  Date.now()
      const decodedToken = jwtDecode(token);
      setUserData({
        name: decodedToken.name,
        lastName: decodedToken.lastName,
        email: decodedToken.email,
        pathImage: decodedToken.pathImage
      });
      setIsTokenChecked(true);
    } else {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
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

  if (!isTokenChecked) {   
      return null;  
  }  


  return (
    <div className="container-fluid" style={{ height: '100vh' }}>
      {/* Navbar para pantallas pequeñas */}
      <Navbar bg="light" expand="lg" className="border-bottom d-lg-none custom-navbar ps-2">
        <div className="d-flex justify-content-between w-100 align-items-center ">
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setMenuOpen(!menuOpen)} >
            <FontAwesomeIcon icon={faBars} style={{ color: 'white' }} />
          </Navbar.Toggle>
          <Navbar.Brand href="#" className="w-100 text-center custom-navbar-brand no-padding-margin ">
            <img src={logo} alt="Profile" className="profile-img" />
            P&A Aires Acondicionados
          </Navbar.Brand>
        </div>
        <Navbar.Collapse id="basic-navbar-nav ">
          <Nav className="me-auto">
            <Nav.Link href="#" className="nav-item" onClick={() => setSelectedComponent('Home')}>
              <FontAwesomeIcon icon={faHome} style={{ marginRight: '10px' }} />
              Home
            </Nav.Link>
            <Nav.Link href="#" className="nav-item" onClick={() => setSelectedComponent('Usuarios')}>
              <FontAwesomeIcon icon={faUsers} style={{ marginRight: '10px' }} />
              Usuarios
            </Nav.Link>
            <Nav.Link href="#" className="nav-item">
              <FontAwesomeIcon icon={faHardDrive} style={{ marginRight: '10px' }} />
              Equipos
            </Nav.Link>
            <Nav.Link href="#" className="nav-item">
              <FontAwesomeIcon icon={faBuildingUser} style={{ marginRight: '10px' }} />
              Clientes
            </Nav.Link>
            <Nav.Link href="#" className="nav-item">
              <FontAwesomeIcon icon={faScrewdriverWrench} style={{ marginRight: '10px' }} />
              Mantenimientos
            </Nav.Link>
            <Nav.Link href="#" className="nav-item">
              <FontAwesomeIcon icon={faFileLines} style={{ marginRight: '10px' }} />
              Control Mantenimientos
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="row h-100">
        {/* Sidebar para pantallas grandes */}
        <div className={`col-auto col-lg-3 border-end p-0 menu d-none d-lg-block`}>
          <div className="d-flex flex-column h-100 gap-2">
            <div className="profile-header d-flex align-items-center">
              <img src={logo} alt="Profile" className="profile-img" />
              <div className="title-profile">
                <h5 className="profile-title">P&A Aires Acondicionados</h5>
                <p className="profile-subtitle">Control de mantenimientos</p>
              </div>
            </div>

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
                <FontAwesomeIcon icon={faHardDrive} style={{ marginRight: '10px' }} />
                Equipos
              </Nav.Link>
              <Nav.Link className="nav-item" href="#">
                <FontAwesomeIcon icon={faBuildingUser} style={{ marginRight: '10px' }} />
                Clientes
              </Nav.Link>
              <Nav.Link className="nav-item" href="#">
                <FontAwesomeIcon icon={faScrewdriverWrench} style={{ marginRight: '10px' }} />
                Mantenimientos
              </Nav.Link>
              <Nav.Link className="nav-item" href="#">
                <FontAwesomeIcon icon={faFileLines} style={{ marginRight: '10px' }} />
                Control Mantenimientos
              </Nav.Link>
            </Nav>

            <div className="mt-auto">
              <div className="profile-header-user d-flex align-items-center">
                <img src={userData.pathImage} alt="Admin" className="profile-img-user" />
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
        </div>

        {/* Contenido principal */}
        <div id="modal-container" className="col-lg-9 position-relative p-0" >
          {selectedComponent === 'Usuarios' && <ListUsers />}
        </div>

        {/* Modal de confirmación de cierre de sesión */}
        <ConfirmationModal
          show={showLogoutModal}
          onHide={handleCancelLogout}
          onConfirm={handleConfirmLogout}
          title="Cierre de Sesión"
          bodyText="¿Estás seguro de que deseas cerrar sesión?"
          confirmText={loading ? <Spinner animation="border" size="sm" /> : "Sí"}
          cancelText="No"
          containerId="modal-container"
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
};

export default AdminDashboard;
