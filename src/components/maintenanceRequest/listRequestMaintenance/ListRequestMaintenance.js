import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Spinner } from 'react-bootstrap';
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


function ListRequestMaintenace() {
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState([]);
    const key = location.state?.key;
    const [selectedOption, setSelectedOption] = useState("Seleccione un rol");
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState([]);
    const [isTokenChecked, setIsTokenChecked] = useState(false);
    
    const [isOpen, setIsOpen] = useState(false);


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

    }, [key]);

    const handleButtonClick = () => {
        navigate('/admin/requestMaintenance/clients');
        // Cambia el estado para mostrar el nuevo componente
    };

    // const validateCients = location.pathname === '/admin/requestMaintenance/clients';
    // if (validateCients) {
    //     return <Outlet />
    // }


    const handleDropdownToggle = () => {
        setIsOpen(!isOpen);
    };

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await getRequestMaintenace(token);
            setData(response.data);
            setRecords(response.data);
            setTimeout(() => {
                setLoading(false);
            }, 1500);

            return () => clearTimeout();

        } catch (error) {
            setLoading(false);
        }
    }

    const columns = [
        {
            name: 'N° Mantenimiento',
            selector: row => row.requestNumber,
            sortable: true,
        },
        {
            name: 'Cliente',
            selector: row => `${row.client.name || ''} ${row.client.lastName || ''}`.trim() || row.client.nameCompany,
            sortable: true,
        },
        {
            name: 'Tecnico',
            selector: row => `${row.technician.name} ${row.technician.lastName}`,
            sortable: true,
        },
        {
            name: 'Fecha',
            selector: row => new Date(row.requestDate).toLocaleDateString('en-GB'), // Format as needed
            sortable: true,
        },
        {
            name: 'Direccion',
            selector: row => row.client.address,
            sortable: true,
        },
    ];

    const isUpdateClient = location.pathname.includes('/admin/requestMaintenance/clients') || location.pathname.includes('registerRequestMaintenance');
    const idUpdateRequestMaintenance = location.pathname.includes('updateRequestMaintenance');
    if(isUpdateClient || idUpdateRequestMaintenance){
        return <Outlet />
    }

    // const validateRegisterRequestMaintenance = location.pathname ===  false //'/admin/requestMaintenance/clients/registerRequestMaintenance';
    // if (validateRegisterRequestMaintenance) {
    //     return <Outlet />;
    // }


    const handleRoleChange = (event) => {
        // setLoading(true);
        // setSelectedOption(event.target.value);
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


    const handleRowClick = (row) => {
        //setLoading(true);
        //setSelectedUser(row);
        console.log(row);  // Guarda la información de la fila seleccionada
        navigate('/admin/requestMaintenance/updateRequestMaintenance', { state: { requestMaintenance: row } });
        //setIsUserDetailsVisible(true);
    };
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

                <div className='col-12 col-md-4 title1' >
                    <h2 className="text-start title">Mantenimientos </h2>
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

                <div className='col-12 col-sm-3 col-md-2' >
                    <Button className="button-Custom" onClick={handleButtonClick}>Agregar Mantenimiento </Button>
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
                                onRowClicked={handleRowClick}
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
            </div>
       
    )

}
export default ListRequestMaintenace;

