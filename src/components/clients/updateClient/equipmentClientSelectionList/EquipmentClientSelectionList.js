import React, { useEffect, useState, useMemo  } from "react";
import { Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import DataTable from 'react-data-table-component';
import { Button, Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { getEquipmentsIdClient } from "../../../../api/EquipmentService";
import "./EquipmentClientList.css";
import { useNavigate, Outlet } from 'react-router-dom';


const EquipmentUserList = ({ selectionAvailableEquipment, setSelectionAvailableEquipment, setIsNewComponentVisibleEquipClient, clientId}) => {
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState("Seleccione un rol");
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [isTokenChecked, setIsTokenChecked] = useState(false);
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);
    const [idsEquipmentsSelection, setIdsEquipmentsSelection] = useState([]);

    const roleMap = {
        "ADMIN": "Administrador",
        "INTERNAL_TECHNICIAN": "Técnico interno",
        "EXTERNAL_TECHNICIAN": "Técnico externo"
    };

    useEffect(() => {
        setTimeout(() => {
            try {
                setLoading(false);
                const token = localStorage.getItem('authToken');
                console.log("token", token);
                if (token !== null && jwtDecode(token).exp * 1000 > Date.now()) { // && jwtDecode(token).exp*1000 >  Date.now()
                    fetchData();
                    setIdsEquipmentsSelection(selectionAvailableEquipment.map(equipment => equipment.id));
                    setIsTokenChecked(true);
                    setLoading(true);
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

        }, 200);
        return () => clearTimeout();

    }, []);

    const fetchData = async () => {
        setLoading(false);
        try {
            const token = localStorage.getItem('authToken');
            const response = await getEquipmentsIdClient(clientId, token);
            setData(response);
            setRecords(response);
            setTimeout(() => {
                setLoading(false);
            }, 1500);

            return () => clearTimeout();

        } catch (error) {
            setLoading(false);
        }
    };

    const columns = [
        {
            name: 'Id',
            selector: row => row.id,
            sortable: true,
            center: true.toString()

        },
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
            center: true.toString()
        },
        {
            name: "Marca",
            selector: row => row.brand,
            sortable: true,
            center: true.toString()
        },

        {
            name: "Modelo",
            selector: row => row.modelNumber,
            sortable: true,
            center: true.toString()
        },
        {
            name: "Tipo de equipo",
            selector: row => row.equipmentType,
            sortable: true,
            center: true.toString()
        },
        {
            name: "No. de serie",
            selector: row => row.serialNumber,
            sortable: true,
            center: true.toString()
        },
        {
            name: "No. en iventario",
            selector: row => row.iventoryNumber,
            sortable: true,
            center: true.toString()
        },
    ];

    const handleChange = (e) => {
        setRecords(data.filter(record => {
            return record.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                record.id.toString().includes(e.target.value.toLowerCase()) ||
                record.brand.toLowerCase().includes(e.target.value.toLowerCase()) ||
                record.modelNumber.toLowerCase().includes(e.target.value) ||
                record.serialNumber.toLowerCase().includes(e.target.value) ||
                record.iventoryNumber.toString().includes(e.target.value.toLowerCase())
        }));
    }

    const handleButtonClick = () => {
        setIsNewComponentVisibleEquipClient(prevState => !prevState); // Cambia el estado para mostrar el nuevo componente
    };

    const handleButtonSave = () => {
        setSelectionAvailableEquipment(selectedRows);
        setIsNewComponentVisibleEquipClient(prevState => !prevState); // Cambia el estado para mostrar el nuevo componente
    };

    const conditionalRowStyles = [
        {
            when: row => true, // Aplica siempre
            style: {
                '&:hover': {
                    backgroundColor: '#f0f0f0',  // Color de fondo al pasar el mouse
                    cursor: 'pointer',           // Cambia el cursor a pointer
                },
            },
        },
    ];

    const handleRowSelected = (state) => {
       
        // setIdsEquipments(state.selectedRows.map(row => row.id));
        setSelectedRows(state.selectedRows);
      
        console.log("selectedRows", state.selectedRows);
        // Aquí se almacena las filas seleccionadas
    };

    //const selectableRowSelected = (row) => {
        // return searchTerm.includes(row.id) 
        // return searchTerm.some(equipment => equipment.id == row.id);
       // return selectedRows.some(selectedRow => selectedRow.id === row.id); // Selecciona solo si el id está en selectedIds y es diferente de null
        //// return selectedRows.includes(row.id) || selectedRows.some(selectedRow => selectedRow.id === row.id); // Selecciona solo si el id está en selectedIds y es diferente de null
     // };

      const selectableRowSelected = useMemo(() => {
        console.log('el length es igual a ', idsEquipmentsSelection.length);
        if(idsEquipmentsSelection.length == 0) {
            console.log("el length es 0", idsEquipmentsSelection);
            return (row) => records.map(record => record.id).includes(row.id);
        }else{
            return (row) => idsEquipmentsSelection.includes(row.id);
        }
       
      }, [idsEquipmentsSelection, records]);
    

    const customPaginationOptions = {
        rowsPerPageText: 'Filas por página',  // Texto para "Rows per page"
        rangeSeparatorText: 'de',             // Texto separador entre los rangos de páginas
        noRowsPerPage: false,
    };

    if (!isTokenChecked) {
        return null;
    }


    return (
        <div className='row'>
            <div className='col-12 col-md-4 title1'>
                <h2 className="text-start title">Equipos-Clientes </h2>
            </div>

            <div className='col-6 col-sm-6 col-md-5 ' >
                <form >
                    <div className='input-container'>
                        <FontAwesomeIcon icon={faSearch} className="icon" />
                        <input className="form-control input-style"
                            placeholder="Buscar por: Id, Marca, Modelo, No. serie o No. inventario"
                            type="search"
                            onChange={handleChange}
                        />
                    </div>
                </form>


            </div>

            <div className='col-6 col-sm-3 col-md-3' >
                <Form>
                    <Form.Group controlId="rolesPro" className="dropdown">
                        <div className="dropdown-container">
                            <Form.Control
                                as="select"
                                name="roles"
                                value={selectedOption} // Valor actual del select
                                // onChange={handleRoleChange}
                                required
                                style={{ border: 'none' }}
                            >
                                <option value="Seleccione un rol">Seleccione un rol</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Tecnico interno">Tecnico interno</option>
                                <option value="Tecnico externo">Tecnico externo</option>
                            </Form.Control>
                            <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
                        </div>
                    </Form.Group>
                </Form>

            </div>

            <div className='col-12'>
                <div className="space-y-4">
                    <div className="table-container">
                        <DataTable
                            columns={columns}
                            data={records}
                            pagination
                            paginationPerPage={10}
                            fixedHeader
                            persistTableHead
                            fixedHeaderScrollHeight="80vh"
                            progressPending={loading}
                            selectableRows
                            onSelectedRowsChange={handleRowSelected}
                            selectableRowSelected={selectableRowSelected} 
                            // selectableRowSelected={(row) => searchTerm.includes(row.id)}
                            conditionalRowStyles={conditionalRowStyles}
                            paginationComponentOptions={customPaginationOptions}
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

            <div className='buttons-equipments-clients' >
                < Button className="button-save" onClick={handleButtonSave}>Guardar</Button>
                <Button className="button-exit" onClick={handleButtonClick} >salir</Button>
            </div>

        </div>

    )
};

export default EquipmentUserList;