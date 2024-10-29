import React from 'react';
import './UserProfileInfo.css';
import { useLocation } from 'react-router-dom';

function UserProfileInfo() {
  const location = useLocation();
  const { user } = location.state || {}; // Acceder a los datos pasados

  if (!user) {
    return <div>Cargando...</div>; // O cualquier mensaje de carga que desees
  }

  return (
    <div className=' full-screen-scrollable row'>

      <div className='col-12'>
        <h2 className="text-start title">Perfil </h2>
      </div>

      <div className='content row '>

        <div className='container-image col-12 col-md-4'>
          <img src={user.pathImage} alt="Imagen de perfil" className="profile-image" />
        </div>
      

      <div className='col-md-8 '>
        <div className='row data'>
          <div className='col-md-6'>
            <label>Nombre:</label>
            <span>{user.name}</span>
          </div>

          <div className='col-md-6'>
            <label >Apellido:</label>
            <span>{user.lastName}</span>
          </div>

          <div className='col-lg-6'>
            <label>Tipo de Identificación:</label>
            <span>{user.typeIdentification}</span>
          </div>

          <div className='col-lg-6'>
            <label>Número de Identificación:</label>
            <span>{user.numberIdentification}</span>
          </div>
          <div className='col-lg-6'>
            <label>Correo Electrónico:</label>
            <span>{user.email}</span>

          </div>
          <div className='col-lg-6'>
            <label>Número de Teléfono:</label>
            <span>{user.phoneNumber}</span>

          </div>
          <div className='col-lg-6'>
            <label>Dirección:</label>
            <span>{user.address}</span>

          </div>
          <div className='col-lg-6'>
            <label>Rol:</label>
            <span>{user.roles}</span> 
          </div>
          <div className='col-lg-6'>
            <label>Estado:</label>
            <span>{user.userStatus ? 'Activo' : 'Inactivo'}</span>
          </div>
  
        </div>

      </div>










    </div>




    </div >


  );
}

export default UserProfileInfo;