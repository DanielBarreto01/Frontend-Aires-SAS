import React, { useEffect, useState, useMemo, useCallback } from 'react';
import './UpdateRequestMaintenance.css';
import { Spinner } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { jwtDecode } from 'jwt-decode';
import { getUsersWithoutAdminRole } from '../../../api/UserService';
import { getEquipmentsIdClientAviable } from '../../../api/EquipmentService';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { createRequestMaintenace } from '../../../api/MaintenanceService'
import CustomToast from '../../toastMessage/CustomToast';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";

function UpdateRequestMaintenance() {
  const navigate = useNavigate();
  const location = useLocation();
  const requestMaintenance = location.state?.requestMaintenance;
  const client = location.state?.newClient || requestMaintenance?.client ;
  const from = location.state?.from || '';
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [recordsTechnician, setRecordsTechnician] = useState([]);
  const [recordsEquipments, setRecordsEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowsEquipments, setSelectedRowsEquipments] = useState([]);
  const [selectedRowsTechnicians, setSelectedRowsTechnicians] = useState([]);
  const [idsEquipmentsSelection, setIdsEquipmentsSelection] = useState([]);
  const [idsTechniciansSelection, setIdsTechniciansSelection] = useState([]);
  const [isEditingButtons, setIsEditingButtons] = useState(false);
  const [showToast, setShowToast] = useState(false);     // Estado para mostrar/ocultar el Toast
  const [toastMessage, setToastMessage] = useState('');  // Estado para el mensaje del Toast
  const [toastType, setToastType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showModalClean, setShowModalClean] = useState(false);
  const [isEditingFormulary, setIsEditingFormulary] = useState(false);
 

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('authToken');
    try {
      const technician = await getUsersWithoutAdminRole(token);
      setRecordsTechnician(technician.data);
      setIdsEquipmentsSelection(requestMaintenance.equipments.map(equip => equip.id));
      setIdsTechniciansSelection([requestMaintenance.technician.id]);
      const equipments = await getEquipmentsIdClientAviable(client.id, token);
      setRecordsEquipments(equipments);
    } catch (error) {
      console.error('Error al obtener los técnicos y equipos:', error);
    }
    setLoading(false);
  }, [client, requestMaintenance]);

  useEffect(() => {
    try {
      typeof requestMaintenance === 'undefined'? navigate('/admin/requestMaintenance'):setLoading(false);
      const token = localStorage.getItem('authToken');
      if (token !== null && jwtDecode(token).exp * 1000 > Date.now()) { // && jwtDecode(token).exp*1000 >  Date.now()
        if (from.includes('listSelectEquipment')) {
          const selectedEqipments = location.state?.selectedEqipments || [];
          setIdsEquipmentsSelection(selectedEqipments.map(item => item.id) || [])
        } else if (from.includes('listSelectedTechnician')) {
          const selectedTechnicians = location.state?.selectedTechnicians || [];
          setIdsTechniciansSelection(selectedTechnicians.map(item => item.id) || [])
        }
         fetchData()
       
        
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
  }, [fetchData, requestMaintenance, from, location.state?.selectedEqipments, location.state?.selectedTechnicians, navigate]);





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

  const handleShowClient = () => {
    console.log('dhdhhdhd', client)
    navigate('/admin/requestMaintenance/updateRequestMaintenance/showClient', { state: { client:client } });
  }
  const handleClientSelection = () => {
    navigate('/admin/requestMaintenance/updateRequestMaintenance/selectionClient');
  }

  const selectionEquipments = () => {
    setIdsEquipmentsSelection(selectedRowsEquipments.map(item => item.id) || []);
    navigate('/admin/requestMaintenance/updateRequestMaintenance/listSelectEquipment', { state: { selectedRowsEquipments, recordsEquipments, requestMaintenance } });

  }
  const selectionTechnician = () => {
    setIdsTechniciansSelection(selectedRowsTechnicians.map(item => item.id) || []);
    navigate('/admin/requestMaintenance/updateRequestMaintenance/listSelectedTechnician', { state: { selectedRowsTechnicians, recordsTechnician, requestMaintenance } });
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setShowModalClean(false); // Cerrar el modal sin realizar acción
  };

  const handleCancelRegister = () => {
    setModalType('cancel');
    setShowModal(true);
  }

  const handleEditingFormulary = () => {
    setIsEditingFormulary(true);
  }

  const handleGoBack = () => {  
    navigate('/admin/requestMaintenance', { state: { key: Date.now() } });
  }

  const handleSaveRegister = () => {
    if (selectedRowsEquipments.length < 1) {
      setShowToast(true)
      setToastType('danger')
      setToastMessage('Debes seleccionar almenos un equipo')
      return

    } else if (selectedRowsTechnicians.length !== 1) {
      setShowToast(true)
      setToastType('danger')
      setToastMessage('Debes seleccionar un técnico')
      return
    }
    setModalType('register');
    setShowModal(true);
  }

  const handleConfirmAction = async () => {
    setShowModal(false);
    if(modalType === 'cancel'){
      // setSelectedRowsEquipments([]);
      // setSelectedRowsTechnicians([]);
      // setIdsEquipmentsSelection([]);
      // setIdsTechniciansSelection([]);
      setIsEditingFormulary(false);
     
    }else if (modalType === 'register') {
      const token = localStorage.getItem('authToken');
      try {
        const sendData = {
          client: client.id,
          technician: (selectedRowsTechnicians.map(equip => equip.id))[0],
          equipments: selectedRowsEquipments.map(tech => tech.id)
        }
        setLoading(true)
        const response = await createRequestMaintenace(sendData, token)
        if (response.status === 200) {
          setLoading(false)
          setShowToast(true)
          setToastType('success')
          setToastMessage('La solicitud de mantenimiento se registro correctamente')
          setIsEditingButtons(true)
          setTimeout(() => {
            navigate("/admin/requestMaintenance", { state: { key: Date.now() } })
          }, 3000);
        }

      } catch (error) {
        const errorMessage =
          error.response.data && error.response.data
            ? error.response.data
            : 'Error al registar la solicitud de mantenimiento. Inténtalo de nuevo.';
        setToastMessage(errorMessage);
        setShowToast(true)
        setToastType('danger')
      }
    }
  }


  const cleanTables  = (type) => {
    if(selectedRowsEquipments.length ===0 && type === 'equipments'){
      return
    }else if(selectedRowsTechnicians.length === 0 && type === 'technician'){
      return
    }
    setModalType(type)
    setShowModalClean(true)
  }

  const handleConfirmActionClean = () => {
    setShowModalClean(false)
    if(modalType === 'equipments'){
      setSelectedRowsEquipments([]);
      setIdsEquipmentsSelection([]);
    }else{
      setSelectedRowsTechnicians([]);
      setIdsTechniciansSelection([]);
    }
  }



  const isListSelectEquipment = location.pathname === '/admin/requestMaintenance/updateRequestMaintenance/listSelectEquipment';
  const isListSelectedTechnician = location.pathname === '/admin/requestMaintenance/updateRequestMaintenance/listSelectedTechnician';
  const isShowClient = location.pathname === '/admin/requestMaintenance/updateRequestMaintenance/showClient';
  const isSelectionClient = location.pathname === '/admin/requestMaintenance/updateRequestMaintenance/selectionClient';
  if (isListSelectEquipment || isListSelectedTechnician || isShowClient || isSelectionClient) {
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




  if (!isTokenChecked) {
    return null;
  }

  if (!client) {
    return <div>Cargando...</div>; // O cualquier mensaje de carga que desees
  }


  return (
    <div className=' full-screen-scrollable row'>

      <div className='col-12'>
        <h2 className="text-start title">Información Mantenimiento </h2>
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
                {isEditingFormulary ? (
                  <>
                    <button type="button" className='button-confirmationn' onClick={handleClientSelection} disabled={isEditingButtons}>
                      Seleccionar
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className='button-confirmationn' onClick={handleShowClient} >
                      Detalles
                    </button>
                  </>
                )}
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
              {isEditingFormulary && (
                <>
                  <button className='button-clean' onClick={selectionEquipments} >
                    Seleccionar
                  </button>
                  <button className='button-clean' onClick={() => cleanTables('equipments')} >
                    Limpiar
                  </button>
                </>)}
            </div>

            <div className="table-container-client-list-quip">
              <DataTable
                columns={columnsEquipments}
                data={recordsEquipments || []}
                pagination
                paginationPerPage={1}
                fixedHeader
                persistTableHead
                fixedHeaderScrollHeight="20vh"
                selectableRows={isEditingFormulary}
                selectableRowsSingle={isEditingFormulary}
                onSelectedRowsChange={isEditingFormulary ? handleRowSelectedEquipments : undefined}
                selectableRowSelected={isEditingFormulary ? selectableRowSelectedEquipments : undefined}
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
              {isEditingFormulary && (
                <>
                  <button className='button-clean' onClick={selectionTechnician} >
                    Seleccionar
                  </button>
                  <button className='button-clean' onClick={() => cleanTables('technician')}>
                    Limpiar
                  </button>
                </>
              )}
            </div>

            <div className="table-container-client-list-quip">
              <DataTable
                columns={columnsTechnical}
                data={recordsTechnician || []}
                pagination
                paginationPerPage={1}
                fixedHeader
                persistTableHead
                fixedHeaderScrollHeight="20vh"
                selectableRows={isEditingFormulary}
                selectableRowsSingle={isEditingFormulary}
                onSelectedRowsChange={isEditingFormulary ? handleRowSelectedTechnicians : undefined}
                selectableRowSelected={isEditingFormulary ? selectableRowSelectedTechnicians : undefined}
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
            <ConfirmationModal
              show={showModalClean}
              onConfirm={handleConfirmActionClean}
              onHide={handleCloseModal}
              title= "Confirmar limpieza de selección"
              bodyText="¿Estás seguro de que deseas limpiar la selección? Se eliminarán todas las selecciones actuales en la tabla."
              confirmText= "Sí"
              cancelText="No"
              containerId="modal-container"
            />

          </div>
        </div>
        <div className="col-lg-6" ></div>
        <div className="col-lg-6 button-group">
          {isEditingFormulary ? (
            <>
              <button type="submit" className='button-confirmationn' onClick={handleSaveRegister} >
                Gardar cambios
              </button>
              <button className='button-cancell' onClick={handleCancelRegister}>
                Cancelar edición
              </button>
            </>
          ) : (
            <>
              <button type="submit" className='button-confirmationn' onClick={handleEditingFormulary} disabled={isEditingButtons}>
                Editar
              </button>
              <button className='button-cancell' onClick={handleGoBack} disabled={isEditingButtons}>
                Regresar
              </button>

            </>)}
        </div>
      </div>
      <ConfirmationModal 
        show={showModal}
        onHide={handleCloseModal}
        onConfirm={handleConfirmAction}
        title={modalType === 'cancel' ? "Cancelar registro" : "Confirmar registro"}
        bodyText={modalType === 'cancel'
          ? "¿Estás seguro de que deseas cancelar el registro? Se perderán todos los datos."
          : "¿Estás seguro de que deseas registrar este equipo?"}
        confirmText={modalType === 'cancel' ? "Sí" : "Sí"}
        cancelText="No"
        containerId="modal-container"
      /> 

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

  );
}

export default UpdateRequestMaintenance;