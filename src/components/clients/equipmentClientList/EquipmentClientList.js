import React, { useEffect, useState, useMemo } from "react";
import { Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import DataTable from 'react-data-table-component';
import { Button, Spinner } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { getEquipmentsAvailable, getEquipmentsIdClient } from "../../../api/EquipmentService";
import "./EquipmentClientList.css";
import { useNavigate, Outlet } from 'react-router-dom';


const EquipmentUserList = ({ selectionAvailableEquipment, setSelectionAvailableEquipment, setIsNewComponentVisibleEquipClient, client}) => {
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState("All");
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [isTokenChecked, setIsTokenChecked] = useState(false);
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);
    const [idsEquipmentsSelection, setIdsEquipmentsSelection] = useState([]);
    const [equipmentsAvailable, setEquipmentsAvailable] = useState([]);
    const [equipmentsAsigned, setEquipmentsAsigned] = useState([]);
    const [validateScreenChange, setValidateScreenChange] = useState(false);

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
        
        const token = localStorage.getItem('authToken');
        try {
            const response = await getEquipmentsAvailable(token);
            if (client == null) {
                setData(response);
                setRecords(response);
            } else {
                const responseExistEquipments = await getEquipmentsIdClient(client.id, token);
                setData(mergeUniqueLists(responseExistEquipments, response));
                setRecords(mergeUniqueLists(responseExistEquipments, response));
                setEquipmentsAsigned(responseExistEquipments)
                setEquipmentsAvailable(response);
            }
            setTimeout(() => {
                setLoading(false);
            }, 1500);

            return () => clearTimeout();

        } catch (error) {
            setLoading(false);
        }
    };

    function updateLists(lista2, lista3) {
        if (lista3.length === 0) {
            lista2.length = 0;
        } else {
            lista2 = lista2.filter(elemento => lista3.includes(elemento));
            lista3.forEach(elemento => {
                if (!lista2.includes(elemento)) {
                    lista2.push(elemento);
                }
            });
        }
        return lista2;
    }

    const mergeUniqueLists = (list1, list2) => {
        return [...list1, ...list2].reduce((acc, current) => {
            if (!acc.find(item => item.id === current.id)) {
                acc.push(current);
            }
            return acc;
        }, []);
    };

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
            center: true.toString()
        },
        {
            name: 'Nombre',
            selector: row => row.name,
            sortable: true,
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
        setSearchText(e.target.value);
        const listSearch = data.filter(record => {
            return record.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                record.brand.toLowerCase().includes(e.target.value.toLowerCase()) ||
                record.modelNumber.toLowerCase().includes(e.target.value) ||
                record.serialNumber.toLowerCase().includes(e.target.value) ||
                record.iventoryNumber.toString().includes(e.target.value.toLowerCase())
        });
        if(listSearch.length > 0){
            updateEquipmentSelectionIds(selectedOption);
        }
        setRecords(listSearch)
    }

    const handleButtonClick = () => {
        setIsNewComponentVisibleEquipClient(prevState => !prevState); // Cambia el estado para mostrar el nuevo componente
    };


    const handleButtonSave = () => {

        if(client == null){

            setSelectionAvailableEquipment(selectedRows);
            setIsNewComponentVisibleEquipClient(prevState => !prevState);
        }else{
            setValidateScreenChange(true);
            updateEquipmentSelectionIds(selectedOption);
            setTimeout(() => {
              setIsNewComponentVisibleEquipClient(prevState => !prevState);
            }, 500);     
            
        }
    };

    if(validateScreenChange){
        setSelectionAvailableEquipment((mergeUniqueLists(equipmentsAsigned, equipmentsAvailable).filter(item => idsEquipmentsSelection.includes(item.id))));
        setValidateScreenChange(false);
    }

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

    function updateList3(list1, list2, list3) {
         const idsList2 = new Set(list1.map(item => item.id));
         list3 = list3.filter(item => !(list2.some(el => el.id === item.id) && !idsList2.has(item.id)));
         list1.forEach(item => {
             if (idsList2.has(item.id) && !list3.some(existingItem => existingItem.id === item.id)) {
                 list3.push(item);
             }
         });  
         return list3;
    }

    const handleRowSelected = (state) => {
        if(records.length > 0){
            setSelectedRows(updateList3(state.selectedRows, records, selectedRows))
        }
    };

    const updateEquipmentSelectionIds = (selectedOptionFilter) => {
        let referenceList = [];
        let comparisonList = selectedRows.map(row => row.id);
        if (selectedOptionFilter === "Asigned") {
            referenceList = equipmentsAvailable.map(row => row.id);
        } else if (selectedOption === "Available") {
            selectedOptionFilter = equipmentsAsigned.map(row => row.id)
        } else {
            setIdsEquipmentsSelection(selectedRows.map(row => row.id))
            return;
        }

        const filteredList1 = idsEquipmentsSelection.filter(item => referenceList.includes(item));
        const updatedList2 = updateLists(referenceList, comparisonList);
        
        setIdsEquipmentsSelection([...new Set([...filteredList1, ...updatedList2])]);
    };

    const handleRoleChange = (newSelectedOption) => {
        setSearchText(''); 
        setSelectedOption(newSelectedOption);
        if (newSelectedOption === "All") {
            setLoading(true);
            setTimeout(() => {
                fetchData();
                setData(mergeUniqueLists(equipmentsAsigned, equipmentsAvailable))
                setRecords(mergeUniqueLists(equipmentsAsigned, equipmentsAvailable));
            }, 200);     
        } else if (newSelectedOption === "Asigned") {
            setData(equipmentsAsigned);
            setRecords(equipmentsAsigned);

        } else if (newSelectedOption === "Available") {
            setData(equipmentsAvailable);
            setRecords(equipmentsAvailable);
        } 


        updateEquipmentSelectionIds(selectedOption);
        
    };

    const selectableRowSelected = useMemo(() => {
        return (row) => idsEquipmentsSelection.includes(row.id);
    }, [idsEquipmentsSelection]);


    const customPaginationOptions = {
        rowsPerPageText: 'Filas por página',  // Texto para "Rows per page"
        rangeSeparatorText: 'de',             // Texto separador entre los rangos de páginas
        noRowsPerPage: false,
    };

    if (!isTokenChecked) {
        return null;
    }

    
    const customStyles = {
        tableWrapper: {
          style: {
            height: '590px', // Define la altura total deseada para la tabla
          },
        },

        pagination: {
            style: {
                marginTop: 'auto', // Empuja la paginación al final del contenedor
                padding: '10px',
                // backgroundColor: 'blue', 
            },
        },
    };


    return (
        <div className='row'>
            <div className='col-12 col-md-5 title1'>
                <h2 className="text-start title">Equipos para {`${client.name || ''} ${client.lastName || ''}`.trim() || client.nameCompany} </h2>
            </div>

            <div className='col-6 col-sm-6 col-md-4 ' >
                <form >
                    <div className='input-container'>
                        <FontAwesomeIcon icon={faSearch} className="icon" />
                        <input className="form-control input-style"
                            placeholder="Buscar por: Id, Marca, Modelo, No. serie o No. inventario"
                            type="search"
                            value={searchText} 
                            onChange={handleChange}
                        />
                    </div>
                </form>


            </div>

            <div className='col-6 col-sm-3 col-md-3' >
                <Form>

                    {client == null ? (

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
                    ) : (
                        <Form.Group controlId="rolesPro" className="dropdown">

                            <div className="dropdown-container">

                                <Form.Control
                                    as="select"
                                    name="roles"
                                    value={selectedOption} // Valor actual del select
                                    onChange={(e) => handleRoleChange(e.target.value)}
                                    required
                                    style={{ border: 'none' }}
                                >
                                    <option value="All">Todos</option>
                                    <option value="Asigned">Asignados</option>
                                    <option value="Available">Disponibles</option>
                                </Form.Control>
                                <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
                            </div>
                        </Form.Group>)}

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
                            fixedHeaderScrollHeight="69vh"
                            progressPending={loading}
                            selectableRows
                            onSelectedRowsChange={handleRowSelected}
                            selectableRowSelected={selectableRowSelected}
                            // selectableRowSelected={(row) => searchTerm.includes(row.id)}
                            conditionalRowStyles={conditionalRowStyles}
                            paginationComponentOptions={customPaginationOptions}
                            customStyles={customStyles}
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
                <Button className="button-save" onClick={handleButtonSave}>Guardar</Button>
                <Button className="button-exit" onClick={handleButtonClick} >salir</Button>
            </div>

        </div>

    )
};

export default EquipmentUserList;