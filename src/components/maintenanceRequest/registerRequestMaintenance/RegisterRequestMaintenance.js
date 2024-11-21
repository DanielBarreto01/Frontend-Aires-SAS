import React from 'react';
import './RegisterRequestMaintenance.css';
import { useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

function RegisterRequestMaintenance() {
  const location = useLocation();
  const { client } = location.state || {};
  const records = []// Acceder a los datos pasados

  if (!client) {
    return <div>Cargando...</div>; // O cualquier mensaje de carga que desees
  }

  const columns = [

    {
      name: 'Equipo',
      selector: row => row.pathImage, // Suponiendo que 'image' es el campo que contiene la URL de la imagen
      cell: row => (
        <img
          src={row.pathImage} // Suponiendo que 'image' es el campo que contiene la URL de la imagen
          alt="imagen"
          style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '80px' }} // Ajusta el tamaño según sea necesario
        />
      ),

    },
    {
      name: 'Nombre',
      selector: row => row.name,
      sortable: true,


    },
    {
      name: "Marca",
      selector: row => row.brand,
      sortable: true,
    },

    {
      name: "Modelo",
      selector: row => row.modelNumber,
      sortable: true,
    },
    {
      name: "Tipo de equipo",
      selector: row => row.equipmentType,
      sortable: true,
    },
    {
      name: "No. de serie",
      selector: row => row.serialNumber,
      sortable: true,
    },
    {
      name: "No. en iventario",
      selector: row => row.iventoryNumber,
      sortable: true,
    },
  ];

  return (
    <div className=' full-screen-scrollable row'>

      <div className='col-12'>
        <h2 className="text-start title">Registrar Mantenimiento </h2>
      </div>

      <div className='content row '>
        {/* 
        <div className='container-image col-12 col-md-4'>
          <img src={client.pathImage} alt="Imagen de perfil" className="profile-image" />
        </div> */}


        <div className='col-md-12 '>
          <div className='row data'>
            <h2 className="text-start title">Información cliente</h2>
            <div className='col-lg-4 col-md-6 col-12'>
              <label>Cliente:</label>
              <span>{`${client.name || ''} ${client.lastName || ''}`.trim() || client.nameCompany}</span>
            </div>
            {/* 
            <div className='col-md-6'>
              <label >Apellido:</label>
              <span>{user.lastName}</span>
            </div> */}


            <div className='col-lg-4 col-md-6 col-12  '>
              <label>Tipo de Identificación:</label>
              <span>{client.clientType === "NaturalPerson" ? client.typeIdentification : 'NIT'}</span>
            </div>

            <div className='col-lg-4 col-md-6 col-12'>
              <label>Número de Identificación:</label>
              <span>{client.clientType === "NaturalPerson" ? client.numberIdentification : client.numberIdentificationCompany}</span>
            </div>

            <div className='col-lg-4 col-md-6 col-12'>
              <label>Número de Teléfono:</label>
              <span>{client.phoneNumber}</span>

            </div>

            <div className='col-lg-4 col-md-6 col-12'>
              <label>Correo Electrónico:</label>
              <span>{client.email}</span>

            </div>

            <div className='col-lg-4 col-md-6 col-12'>
              <label>Dirección:</label>
              <span>{client.address}</span>

            </div>

          </div>

        </div>

      </div>
      <div className='row'>
        <div className='col-lg-6 col-12'>
          <div className='row table-container-update-client'>

            <div className='col-12 col-md-5 title-equip' ><h2>Equipos</h2></div>
            <div className='col-12 col-md-7 button-group-list-equip'>
              <button type="submit" className='button-clean' >
                Seleccionar
              </button>
              <button className='button-clean'  >
                Limpiar
              </button>
            </div>

            <div className="table-container-client-list-quip">
              <DataTable
                columns={columns}
                data={records}
                pagination
                paginationPerPage={2}
                fixedHeader
                persistTableHead
                fixedHeaderScrollHeight="30vh"
                // conditionalRowStyles={conditionalRowStyles}
                // paginationComponentOptions={customPaginationOptions}
                noDataComponent="No hay datos disponibles"
                progressComponent={(
                  <div className="loading-overlay">
                    <Spinner animation="border" size="lg" />
                  </div>
                )}
              />
            </div>

          </div>
        </div>

        <div className='col-lg-6 col-12'>
          <div className='row table-container-update-client'>

            <div className='col-12 col-md-5 title-equip' ><h2>Técnico</h2></div>
            <div className='col-12 col-md-7 button-group-list-equip'>
              <button type="submit" className='button-clean' >
                Seleccionar
              </button>
              <button className='button-clean' >
                Limpiar
              </button>
            </div>

            <div className="table-container-client-list-quip">
              <DataTable
                columns={columns}
                data={records}
                pagination
                paginationPerPage={2}
                fixedHeader
                persistTableHead
                fixedHeaderScrollHeight="30vh"
                // conditionalRowStyles={conditionalRowStyles}
                // paginationComponentOptions={customPaginationOptions}
                noDataComponent="No hay datos disponibles"
                progressComponent={(
                  <div className="loading-overlay">
                    <Spinner animation="border" size="lg" />
                  </div>
                )}
              />
            </div>

          </div>
        </div>
        <div className="col-lg-6" ></div>
        <div className="col-lg-6 button-group">
          <button type="submit" className='button-confirmationn'  >
            Registrar Mantenimiento
          </button>
          <button className='button-cancell' >
            Cancelar Registro
          </button>

        </div>


      </div>




    </div >


  );
}

export default RegisterRequestMaintenance;