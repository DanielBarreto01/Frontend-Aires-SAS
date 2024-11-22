import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from 'jwt-decode';
import "../../general.css";
import "../../user/listUsers/ListUsers.css";
import { Form } from 'react-bootstrap';
import { getRequestMaintenace } from "../../../api/MaintenanceService";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';


function ListSelectedTechnician({ selectionTechnician, setSelectionTechnician, setIsNewComponentVisibleTech, client, loadData}) {
    const navigate = useNavigate();
    const location = useLocation();
    // const client = location.state?.client || {};
    // const loadData = location.state?.recordsTechnician;
    const [data, setData] = useState(loadData || []);
    const [records, setRecords] = useState(loadData || []);
    const [selectedOption, setSelectedOption] = useState("Seleccione un rol");
    const [loading, setLoading] = useState(true);
    let url = "/users/getUsers";
    const [isTokenChecked, setIsTokenChecked] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [idsTechniciansSelection, setIdsTechniciansSelection] = useState();
    const [isOpen, setIsOpen] = useState(false);


    const roleMap = {
        "ADMIN": "Administrador",
        "INTERNAL_TECHNICIAN": "Técnico interno",
        "EXTERNAL_TECHNICIAN": "Técnico externo"
    };


    useEffect(() => {

        try {
            setLoading(false);
            const token = localStorage.getItem('authToken');
            console.log("token", token);
            if (token !== null && jwtDecode(token).exp * 1000 > Date.now()) { // && jwtDecode(token).exp*1000 >  Date.now()
                fetchData();
                setIsTokenChecked(true);
                setIdsTechniciansSelection(selectionTechnician.map(technician => technician.id))
                //setLoading(true);
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
        console.log("selectedRowstech", selectedRows);
        setSelectionTechnician(selectedRows)
        setIsNewComponentVisibleTech(false)

       // navigate("/admin/requestMaintenance/clients/registerRequestMaintenance", { state: { selectedTechnicians: selectedRows, from: location.pathname, client } })
    };
    const handleButtonCancel = () => {
        setIsNewComponentVisibleTech(false)
        //navigate(-1);
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
            // const token = localStorage.getItem('authToken');
            // const response = await getRequestMaintenace(token);
            setData(loadData);
            setRecords(loadData);
            // setTimeout(() => {
            //     setLoading(false);
            // }, 1500);

            // return () => clearTimeout();

        } catch (error) {
            setLoading(false);
        }
    }

    const columns = [
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
            name: "Nombre",
            selector: row => `${row.name} ${row.lastName}`,
            sortable: true,

        },

        {
            name: "Documento",
            selector: row => row.numberIdentification,
            sortable: true,
        },
        {
            name: "Teléfono",
            selector: row => row.phoneNumber,
            sortable: true,
        },
        {
            name: "Correo",
            selector: row => row.email,
            sortable: true,
        },
        {
            name: "Estado",
            selector: row => row.userStatus === true ? "Activo" : "Inactivo",
            sortable: true,
        },
        {
            name: "Tipo de usuario",
            selector: row => row.roles.map(role => role.name).map(role => roleMap[role] || role),
            sortable: true,
        }
    ]




    // const validateRegisterRequestMaintenance = location.pathname ===  false //'/admin/requestMaintenance/clients/registerRequestMaintenance';
    // if (validateRegisterRequestMaintenance) {
    //     return <Outlet />;
    // }

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
        return (row) => idsTechniciansSelection.includes(row.id);
    }, [idsTechniciansSelection]);


    const handleRowSelected = (state) => {
        if (records.length > 0) {
            console.log("hfggfgfgfgf", state.selectedRows);
            setSelectedRows(updateList3(state.selectedRows, records, selectedRows))
        }
    };




    const handleRoleChange = (event) => {
        setSelectedOption(event.target.value);
        console.log("eventKey", event.target.value);

        if (event.target.value === "Seleccione un rol") {
            setRecords(loadData);
            setData(loadData);
        } else if (event.target.value === "Tecnico interno") {
            const filter = loadData.filter(record => record.roles.some(role => role.name === 'INTERNAL_TECHNICIAN'));
            setRecords(filter);
            setData(filter);
        } else {
            const filter = loadData.filter(record => record.roles.some(role => role.name === 'EXTERNAL_TECHNICIAN'));
            setRecords(filter);
            setData(filter);
        }

        if (selectedRows === "Seleccione un rol") {
            setIdsTechniciansSelection(selectedRows.map(row => row.id));
        } else if (selectedRows === "Tecnico interno") {
            setIdsTechniciansSelection(selectedRows.map(row => row.id));
        } else {
            setIdsTechniciansSelection(selectedRows.map(row => row.id));

        }

    };



    const handleChange = (e) => {
        setRecords(data.filter(record => {
            return record.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                `${record.name} ${record.lastName}`.toLowerCase().includes(e.target.value.toLowerCase()) ||
                record.lastName.toLowerCase().includes(e.target.value.toLowerCase()) ||
                record.numberIdentification.includes(e.target.value) ||
                record.phoneNumber.toString().includes(e.target.value) ||
                record.email.toLowerCase().includes(e.target.value.toLowerCase())
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
                <h2 className="text-start title">Tec-equip-clientes </h2>
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
                            selectableRowsSingle
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

    );

}
export default ListSelectedTechnician;

