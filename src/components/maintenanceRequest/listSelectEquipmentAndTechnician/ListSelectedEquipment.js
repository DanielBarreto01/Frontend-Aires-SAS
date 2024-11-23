import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from 'jwt-decode';
import "../../general.css";
import { Form } from 'react-bootstrap';
import { getEquipments } from "../../../api/EquipmentService";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';


function ListSelectEquipment() {
    const navigate = useNavigate();
    const location = useLocation();
    const client = location.state?.client || {};
    const loadData = location.state?.recordsEquipments || [];
    const initialSelection = location.state?.selectedRowsEquipments || [];
    const [data, setData] = useState();
    const [selectedOption, setSelectedOption] = useState("Seleccione un rol");
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState([]);
    const [isTokenChecked, setIsTokenChecked] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [idsEquipmentsSelection, setIdsEquipmentsSelection] = useState([]);       


    useEffect(() => {
            try {
                client === undefined? navigate('/admin/requestMaintenance'):setLoading(false);
                setLoading(false);
                const token = localStorage.getItem('authToken');
                if (token !== null && jwtDecode(token).exp * 1000 > Date.now()) { // && jwtDecode(token).exp*1000 >  Date.now()
                    fetchData();                    
                    setIdsEquipmentsSelection(initialSelection.map(row => row.id));
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

    }, []);

    const handleButtonClick = () => {
        navigate("/admin/requestMaintenance/clients/registerRequestMaintenance", { state: { from: location.pathname, selectedEqipments: selectedRows, client } });	
    };

    const handleButtonCancel = () => {
       navigate("/admin/requestMaintenance/clients/registerRequestMaintenance", { state: { from: undefined, client } });
    }   

    // const validateCients = location.pathname === '/admin/requestMaintenance/clients';
    // if (validateCients) {
    //     return <Outlet />
    // }


    const handleDropdownToggle = () => {
        setIsOpen(!isOpen);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setTimeout(() => {
                setData(loadData);
                setRecords(loadData);
                setLoading(false);
            }, 300);
        } catch (error) {
            setLoading(false);
        }
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

    // const isUpdateClient = location.pathname.includes('/admin/requestMaintenance/clients') || location.pathname.includes('registerRequestMaintenance');
    // if(isUpdateClient){
    //     return <Outlet />
    // }

    // const validateRegisterRequestMaintenance = location.pathname ===  false //'/admin/requestMaintenance/clients/registerRequestMaintenance';
    // if (validateRegisterRequestMaintenance) {
    //     return <Outlet />;
    // }


    const handleRoleChange = (event) => {
        setLoading(true);
        setSelectedOption(event.target.value);
        // console.log("eventKey", event.target.value);
        // setTimeout(() => {
        //     if (event.target.value === "Seleccione un rol") {
        //         url = "/users/getUsers";
        //     } else {
        //         url = `/users/ShowUserRoles/${event.target.value}`;
        //     }
        //     fetchData();
        // }, 200);
        // return () => clearTimeout();
    };

    const handleRowSelected = (state) => {
        if (records.length > 0) {
            setSelectedRows(updateList3(state.selectedRows, records, selectedRows));
        }
    };

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

   


 

    const selectableRowSelected = useMemo(() => {
     
        console.log("carga por defecto", idsEquipmentsSelection)
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


    return (

       
            <div className='row'  >

                <div className='col-12 col-md-6 title1' >
                    <h2 className="text-start title">Mant-equip-clientes </h2>
                </div>

                <div className='col-6 col-sm-6 col-md-4' >
                    <form >
                        <div className='input-container'  >
                            <FontAwesomeIcon icon={faSearch} className="icon" />
                            <input className="form-control input-style"
                                placeholder="Buscar por: Nombre, Documento, Teléfono o Correo"
                                type="search"
                                onChange={handleChange}
                            />
                        </div>
                    </form>
                </div>

                <div className='col-6 col-sm-3 col-md-2' >
                    <Form>
                        <Form.Group controlId="rolesPro" className="dropdown">
                            <div className="dropdown-container">
                                <Form.Control
                                    as="select"
                                    name="roles"
                                    value={selectedOption} // Valor actual del select
                                    onChange={handleRoleChange}
                                    required
                                    onClick={handleDropdownToggle}
                                    style={{ border: 'none' }}
                                >
                                    <option value="Seleccione un rol">Seleccione un rol</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Tecnico interno">Tecnico interno</option>
                                    <option value="Tecnico externo">Tecnico externo</option>
                                </Form.Control>
                                {/* <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" /> */}

                                <FontAwesomeIcon
                                    icon={isOpen ? faChevronUp : faChevronDown}
                                    className="icon "
                                />
                            </div>
                        </Form.Group>

                    </Form>

                </div>

            <div className='col-12' >
                <div className="space-y-4">
                    <div className="table-container" >
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
            <div className="row" >
                <div className="col-lg-6" ></div>
                <div className='button-group col-lg-6' >
                    <Button className="button-Custom" onClick={handleButtonClick}>Guardar</Button>
                    <Button className="button-Custom" onClick={handleButtonCancel}>Regresar</Button>
                </div>
            </div>

        </div>
       
    )

}
export default ListSelectEquipment;

