import React, { useEffect, useState, useMemo } from 'react';
import './RegisterRequestMaintenance.css';
import { Spinner } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { jwtDecode } from 'jwt-decode';
import { getUsersWithoutAdminRole } from '../../../api/UserService';
import { getEquipmentsIdClientAviable } from '../../../api/EquipmentService';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import ListSelectEquipment from '../listSelectEquipmentAndTechnician/ListSelectedEquipment'
import ListSelectedTechnician from '../listSelectEquipmentAndTechnician/ListSelectedTechnician'
import { createRequestMaintenace } from '../../../api/MaintenanceService'
import CustomToast from '../../toastMessage/CustomToast';

function RegisterRequestMaintenance() {
  const navigate = useNavigate();
  const location = useLocation();
  //const client  = location.state?.client || {};
  const client = location.state?.client || [];
  const from = location.state?.from || '';
  const records = []// Acceder a los datos pasados
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [recordsTechnician, setRecordsTechnician] = useState([]);
  const [recordsEquipments, setRecordsEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowsEquipments, setSelectedRowsEquipments] = useState([]);
  const [selectedRowsTechnicians, setSelectedRowsTechnicians] = useState([]);
  const [idsEquipmentsSelection, setIdsEquipmentsSelection] = useState([]);
  const [idsTechniciansSelection, setIdsTechniciansSelection] = useState([]);
  const [isNewComponentVisibleEquip, setIsNewComponentVisibleEquip] = useState(false)
  const [isNewComponentVisibleTech, setIsNewComponentVisibleTech] = useState(false)
  const [isEditingButtons, setIsEditingButtons] = useState(false);

  const [showToast, setShowToast] = useState(false);     // Estado para mostrar/ocultar el Toast
  const [toastMessage, setToastMessage] = useState('');  // Estado para el mensaje del Toast
  const [toastType, setToastType] = useState('');
  useEffect(() => {
    try {
      setLoading(false);
      const token = localStorage.getItem('authToken');
      console.log("token", token);
      if (token !== null && jwtDecode(token).exp * 1000 > Date.now()) { // && jwtDecode(token).exp*1000 >  Date.now()

        if (from.includes('listSelectEquipment')) {
          const selectedEqipments = location.state?.selectedEqipments || [];
          console.log("selectedEqipmentsddddddd", selectedEqipments);
          setIdsEquipmentsSelection(selectedEqipments.map(item => item.id) || [])
        } else if (from.includes('listSelectedTechnician')) {
          const selectedTechnicians = location.state?.selectedTechnicians || [];
          console.log("selectedTechnicianssss", selectedTechnicians);
          setIdsTechniciansSelection(selectedTechnicians.map(item => item.id) || [])
        }
        fetchData();
        setIsTokenChecked(true);
      } else {
        localStorage.removeItem('authToken');
        setLoading(false);
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error al verificar el token:', error);
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  }, [client]);

  const fetchData = async () => {
    setLoading(true);
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
      selector: row => `${row.name} ${row.lastName}`,
      sortable: true,


    },
    {
      name: "Docuemnto",
      selector: row => row.numberIdentification,
      sortable: true,
    }
  ];

  const selectableRowSelectedEquipments = useMemo(() => {
    return (row) => idsEquipmentsSelection.includes(row.id);
  }, [idsEquipmentsSelection]);

  const selectableRowSelectedTechnicians = useMemo(() => {
    return (row) => idsTechniciansSelection.includes(row.id);
  }, [idsTechniciansSelection]);

  const selectionEquipments = () => {
    //setIdsEquipmentsSelection(selectedRowsEquipments.map(item => item.id) || []);
    setIsNewComponentVisibleEquip(true)
    //navigate('/admin/requestMaintenance/clients/registerRequestMaintenance/listSelectEquipment', { state: { selectedRowsEquipments, recordsEquipments, client } });
  }
  const selectionTechnician = () => {
    //setIdsTechniciansSelection(selectedRowsTechnicians.map(item => item.id) || []);
    setIsNewComponentVisibleTech(true)
    //navigate('/admin/requestMaintenance/clients/registerRequestMaintenance/listSelectedTechnician', { state: { selectedRowsTechnicians, recordsTechnician, client } });
  }

  const handleSaveRegister = async () => {
    const token = localStorage.getItem('authToken');
    try {
      if (selectedRowsEquipments.length < 1) {
        setShowToast(true)
        setToastType('danger')
        setToastMessage('Debes seleccionar almenos un equipo')
        return

      } else if (selectedRowsTechnicians.length != 1) {
        setShowToast(true)
        setToastType('danger')
        setToastMessage('Debes seleccionar un tecnico')
        return
      }
      const sendData = {
        client: client.id,
        technician: (selectedRowsTechnicians.map(equip => equip.id))[0],
        equipments: selectedRowsEquipments.map(tech => tech.id)
      }
      console.log(sendData)
      setLoading(true)
      const response = await createRequestMaintenace(sendData, token)
      if (response.status === 200) {
        setLoading(false)
        setShowToast(true)
        setToastType('success')
        setToastMessage('La solicitud de mantenimiento se registro correctamente')
        setIsEditingButtons(true)
        setTimeout(() => {
          navigate(-2)
        }, 3000);
      }

    } catch (error) {
      const errorMessage =
        error.response.data && error.response.data
          ? error.response.data
          : 'Error al actualizar el equipo. Inténtalo de nuevo.';
      setToastMessage(errorMessage);
      setShowToast(true)
      setToastType('danger')
    }

  }

  const cleanEquipments = () => {
    setSelectedRowsEquipments([]);
    setIdsEquipmentsSelection([]);
  }

  const cleanTechnician = () => {
    setSelectedRowsTechnicians([]);
    setIdsTechniciansSelection([]);
  }



  const isListSelectEquipment = location.pathname === '/admin/requestMaintenance/clients/registerRequestMaintenance/listSelectEquipment';
  const isListSelectedTechnician = location.pathname === '/admin/requestMaintenance/clients/registerRequestMaintenance/listSelectedTechnician';
  if (isListSelectEquipment || isListSelectedTechnician) {
    return <Outlet />;
  }

  const handleRowSelectedEquipments = (state) => {
    if (recordsEquipments.length > 0) {
      setSelectedRowsEquipments(state.selectedRows);
    }
  };
  const handleRowSelectedTechnicians = (state) => {
    if (recordsTechnician.length > 0) {
      setSelectedRowsTechnicians(state.selectedRows);
    }
  };

  const handleCancelRegister = () => {
    navigate(-2)
  }


  if (!isTokenChecked) {
    return null;
  }

  if (!client) {
    return <div>Cargando...</div>; // O cualquier mensaje de carga que desees
  }


  return (isNewComponentVisibleEquip ? (<ListSelectEquipment
    selectionEquipment={selectedRowsEquipments}
    setSelectionEquipment={setSelectedRowsEquipments}
    setIsNewComponentVisibleEquip={setIsNewComponentVisibleEquip}
    client={client}
    loadData={recordsEquipments} />
  ) : isNewComponentVisibleTech ? (<ListSelectedTechnician
    selectionTechnician={selectedRowsTechnicians}
    setSelectionTechnician={setSelectedRowsTechnicians}
    setIsNewComponentVisibleTech={setIsNewComponentVisibleTech}
    client={client}
    loadData={recordsTechnician}
  />
  ) : (
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
              <button className='button-clean' onClick={selectionEquipments} disabled={isEditingButtons}>
                Seleccionar
              </button>
              <button className='button-clean' onClick={cleanEquipments} disabled={isEditingButtons}>
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
                onSelectedRowsChange={handleRowSelectedEquipments}
                selectableRowSelected={selectableRowSelectedEquipments}
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
              <button className='button-clean' onClick={selectionTechnician} disabled={isEditingButtons}>
                Seleccionar
              </button>
              <button className='button-clean' onClick={cleanTechnician} disabled={isEditingButtons}>
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
                onSelectedRowsChange={handleRowSelectedTechnicians}
                selectableRowSelected={selectableRowSelectedTechnicians}
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
          <button type="submit" className='button-confirmationn' onClick={handleSaveRegister} disabled={isEditingButtons}>
            Registrar Mantenimiento
          </button>
          <button className='button-cancell' onClick={handleCancelRegister} disabled={isEditingButtons}>
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
      <CustomToast
        showToast={showToast}
        setShowToast={setShowToast}
        toastMessage={toastMessage}
        toastType={toastType}
      />

    </div >

  )

  );
}

export default RegisterRequestMaintenance;