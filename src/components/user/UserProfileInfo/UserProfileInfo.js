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
    <div className="user-profile-info">
      <h2>Información del Perfil</h2>
      <div className="profile-field">
        <label>Nombre:</label>
        <span>{user.name}</span>
      </div>
      <div className="profile-field">
        <label>Apellido:</label>
        <span>{user.lastName}</span>
      </div>
      <div className="profile-field">
        <label>Tipo de Identificación:</label>
        <span>{user.typeIdentification}</span>
      </div>
      <div className="profile-field">
        <label>Número de Identificación:</label>
        <span>{user.numberIdentification}</span>
      </div>
      <div className="profile-field">
        <label>Correo Electrónico:</label>
        <span>{user.email}</span>
      </div>
      <div className="profile-field">
        <label>Número de Teléfono:</label>
        <span>{user.phoneNumber}</span>
      </div>
      <div className="profile-field">
        <label>Dirección:</label>
        <span>{user.address}</span>
      </div>
      <div className="profile-field">
        <label>Rol:</label>
        <span>{user.roles.join(', ')}</span>
      </div>
      <div className="profile-field">
        <label>Estado:</label>
        <span>{user.userStatus ? 'Activo' : 'Inactivo'}</span>
      </div>
    </div>
  );
}

export default UserProfileInfo;