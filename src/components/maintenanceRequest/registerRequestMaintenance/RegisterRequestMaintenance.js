import React from 'react';
import './RegisterRequestMaintenance.css';
import { useLocation } from 'react-router-dom';

function RegisterRequestMaintenance() {
  const location = useLocation();
  const { client } = location.state || {}; // Acceder a los datos pasados

  if (!client) {
    return <div>Cargando...</div>; // O cualquier mensaje de carga que desees
  }

  return (
    <div className=' full-screen-scrollable row'>

      <div className='col-12'>
        <h2 className="text-start title">Perfil </h2>
      </div>

      <div className='content row '>

        <div className='container-image col-12 col-md-4'>
          <img src={client.pathImage} alt="Imagen de perfil" className="profile-image" />
        </div>
      

      <div className='col-md-8 '>
        <div className='row data'>
          <div className='col-md-6'>
            <label>Nombre:</label>
            <span>{`${client.name || ''} ${client.lastName || ''}`.trim() || client.nameCompany}</span>
          </div>
{/* 
          <div className='col-md-6'>
            <label >Apellido:</label>
            <span>{user.lastName}</span>
          </div> */}

          <div className='col-lg-6'>
            <label>Tipo de Identificación:</label>
            <span>{client.clientType === "NaturalPerson"? client.typeIdentification: 'NIT'}</span>
          </div>

          <div className='col-lg-6'>
            <label>Número de Identificación:</label>
            <span>{client.clientType === "numberIdentification"? client.numberIdentification: client.numberIdentificationCompany}</span>
          </div>
          <div className='col-lg-6'>
            <label>Correo Electrónico:</label>
            <span>{client.email}</span>

          </div>
          <div className='col-lg-6'>
            <label>Número de Teléfono:</label>
            <span>{client.phoneNumber}</span>

          </div>
          <div className='col-lg-6'>
            <label>Dirección:</label>
            <span>{client.address}</span>

          </div>
  
        </div>

      </div>










    </div>




    </div >


  );
}

export default RegisterRequestMaintenance;