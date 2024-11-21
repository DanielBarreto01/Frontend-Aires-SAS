import React, { useEffect, useState } from 'react';
import './RegisterRequestMaintenance.css';
import { useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { jwtDecode } from 'jwt-decode';
import { getUsersWithoutAdminRole } from '../../../api/UserService';
import { getEquipmentsIdClientAviable } from '../../../api/EquipmentService';

function RegisterRequestMaintenance() {
  const location = useLocation();
  const { client } = location.state || {};
  const records = []// Acceder a los datos pasados
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [recordsTechnician, setRecordsTechnician] = useState([]);
  const [recordsEquipments, setRecordsEquipments] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setTimeout(() => {
      try {
        setLoading(false);
        const token = localStorage.getItem('authToken');
        console.log("token", token);
        if (token !== null && jwtDecode(token).exp * 1000 > Date.now()) { // && jwtDecode(token).exp*1000 >  Date.now()
          fetchData();
          setIsTokenChecked(true);
          setLoading(true);
        } else {
          localStorage.removeItem('authToken');
          // setLoading(false);
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }

    }, 200);
    return () => clearTimeout();
  }, []);


  const fetchData = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const technician = await getUsersWithoutAdminRole(token);
      setRecordsTechnician(technician.data);
      const equipments = await getEquipmentsIdClientAviable(client.id, token);
      setRecordsEquipments(equipments);
    } catch (error) {
      console.error('Error al obetenr los tecnicos:', error);
     
    }
    setLoading(false);
  }


  if (!client) {
    return <div>Cargando...</div>; // O cualquier mensaje de carga que desees
  }

  const columnsEquipments = [

    {
      name: 'Representacion',
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
      name: 'Marca',
      selector: row => row.name,
      sortable: true,


    },
    {
      name: "Modelo",
      selector: row => row.brand,
      sortable: true,
    }
  ];

  const columnsTechnical = [

    {
      name: 'Usuario',
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
      selector: row =>  `${row.name} ${row.lastName}`,
      sortable: true,


    },
    {
      name: "Docuemnto",
      selector: row => row.numberIdentification,
      sortable: true,
    }
  ];


  if (!isTokenChecked) {
    return null;
  }


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

            <div className='row'>
              <div className='col-lg-6 col-12'> </div>
              <div className="col-lg-6 col-12 button-group">
                <button type="button" className='button-confirmationn'>
                  Detalles
                </button>
              </div>
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
                columns={columnsEquipments}
                data={recordsEquipments || []}
                pagination
                paginationPerPage={2}
                fixedHeader
                persistTableHead
                fixedHeaderScrollHeight="30vh"
                selectableRows
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
                columns={columnsTechnical}
                data={recordsTechnician || []}
                pagination
                paginationPerPage={2}
                fixedHeader
                persistTableHead
                fixedHeaderScrollHeight="30vh"
                selectableRows
                selectableRowsSingle
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

      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      )}


    </div >


  );
}

export default RegisterRequestMaintenance;