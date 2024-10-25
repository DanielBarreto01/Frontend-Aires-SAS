import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendarDays, faHome, faGear, faRightFromBracket, faHardDrive, faBars, faFileLines, faScrewdriverWrench, faBuildingUser } from '@fortawesome/free-solid-svg-icons';
import { Nav, Spinner, Navbar, Button } from 'react-bootstrap';  // Asegúrate de que el Spinner esté importado
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
  const [showSidebar, setShowSidebar] = useState(true);


  // Estado para controlar la visibilidad del menú
  const [isMenuVisible, setMenuVisible] = useState(true);




  useEffect(() => {  // Mostrar el spinner
    const token = localStorage.getItem('authToken');
    if (token !== null && jwtDecode(token).exp * 1000 > Date.now()) { //&& jwtDecode(token).exp*1000 >  Date.now()
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





  // Función para alternar la visibilidad
  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  if (!isTokenChecked) {
    return null;
  }



  {/* <div className={`col-2 ${isMenuVisible ? '' : 'd-none'}`} style={{ minWidth: '265px', padding: 0, backgroundColor: 'yellow' }}> */ }

  return (

    <div className="container-fluid ">


      <div className="row custom-row" >
        {/* Menú lateral */}

        <div className={`col-2 ${isMenuVisible ? '' : 'd-none'}`} style={{ minWidth: '265px', padding: 0, }}>

          <Nav className=" menuU h-100">

            <div className="section-1">
              <Nav.Link className="profile-header" style={{ padding: 0 }} >
                <img src={logo} alt="Profile" className="profile-img" />
                <div className="title-profile">
                  <h5 className="profile-title">P&A Aires Acondicionados</h5>
                  <p className="profile-subtitle">Control de mantenimientos</p>
                </div>
              </Nav.Link>

              <Nav.Link className="nav-item-custom" onClick={() => setSelectedComponent('Home')}>
                <FontAwesomeIcon className="icon-margin" icon={faHome} />
                Home
              </Nav.Link>

              <Nav.Link className="nav-item-custom" onClick={() => setSelectedComponent('Usuarios')}>
                <FontAwesomeIcon className="icon-margin" icon={faUsers} />
                Usuarios
              </Nav.Link>
              <Nav.Link className="nav-item-custom" >
                <FontAwesomeIcon className="icon-margin" icon={faHardDrive} />
                Equipos
              </Nav.Link>
              <Nav.Link className="nav-item-custom">
                <FontAwesomeIcon className="icon-margin" icon={faBuildingUser} />
                Clientes
              </Nav.Link>
              <Nav.Link className="nav-item-custom">
                <FontAwesomeIcon className="icon-margin" icon={faScrewdriverWrench} />
                Mantenimientos
              </Nav.Link>
              <Nav.Link className="nav-item-custom">
                <FontAwesomeIcon className="icon-margin" icon={faFileLines} />
                Control Mantenimientos
              </Nav.Link>
              <div className="separator-line" />
            </div>

            <div className="section-2">
              <div className="separator-line" />
              <Nav.Link className='profile-header-user'>
                <img src={userData.pathImage} alt="Admin" className="profile-img-user" />
                <div className="title-profile">
                  <h5 className="profile-title-user">{userData.name} {userData.lastName}</h5>
                  <p className="profile-subtitle-user">{userData.email}</p>
                </div>
              </Nav.Link>
            </div>

            <div className="section-3">
              <Nav.Link className="nav-item-custom">
                <FontAwesomeIcon className="icon-margin" icon={faGear} />
                Configuración
              </Nav.Link>

              <Nav.Link className="nav-item-custom" onClick={handleLogoutClick}>
                <FontAwesomeIcon className="icon-margin" icon={faRightFromBracket} />
                Cerrar Sesión
              </Nav.Link>
            </div>
          </Nav>


        </div>


        {/* Contenido principal */}



        <div className="col custom-col">


          <div className="row">

            <div className="top-bar d-md-none">
              <button onClick={toggleMenu} style={{ margin: '10px' }}>
                <FontAwesomeIcon className="icon-margin" icon={faBars} />
              </button>
            </div>

            {selectedComponent === 'Usuarios' && <ListUsers />}
            {isMenuVisible && <div className="content-overlay" onClick={toggleMenu}></div>}
          </div>
        </div>
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


      {/* Spinner global que se muestra mientras el logout está en proceso  */}
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      )}


    </div>
  );
};

export default AdminDashboard;
