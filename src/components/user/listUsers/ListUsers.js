import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserDetails from '../userProfile/UserProfile';
import axios from 'axios';
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from 'jwt-decode';
import "../../general.css";
import "../../user/listUsers/ListUsers.css";
import RegisterUser from '../registerUser/RegisterUser';
import { Form, Row, Col } from 'react-bootstrap';



function ListUsers() {
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState("Seleccione un rol");
    const [loading, setLoading] = useState(true);
    const [isNewComponentVisible, setIsNewComponentVisible] = useState(false);
    const [records, setRecords] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    let url = "/users/getUsers";
    const [isTokenChecked, setIsTokenChecked] = useState(false);
    const [isUserDetailsVisible, setIsUserDetailsVisible] = useState(false);
    const [search, setSearch] = useState("name");
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

    const handleButtonClick = () => {
        setIsNewComponentVisible(prevState => !prevState); // Cambia el estado para mostrar el nuevo componente
    };

    const [isOpen, setIsOpen] = useState(false);  

    const handleDropdownToggle = () => {
        setIsOpen(!isOpen);  
    };

    const fetchData = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            };
            const response = await axios.get(url, config);
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


    const handleRoleChange = (event) => {
        setLoading(true);
        setSelectedOption(event.target.value);
        console.log("eventKey", event.target.value);
        setTimeout(() => {
            if (event.target.value === "Seleccione un rol") {
                url = "/users/getUsers";
            } else {
                url = `/users/ShowUserRoles/${event.target.value}`;
            }
            fetchData();
        }, 200);
        return () => clearTimeout();
    };

    const handleSearchInput = (event) => {
        setSearch(event.target.value);
    }

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
        setLoading(true);
        setSelectedUser(row);
        console.log(row);  // Guarda la información de la fila seleccionada
        setIsUserDetailsVisible(true);
    };
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

        isUserDetailsVisible ? (
            <UserDetails user={selectedUser} />
        ) : isNewComponentVisible ? (
            <RegisterUser />
        ) : (
            <div className='row'  >

                <div className='col-12 col-md-4 title1' >
                    <h2 className="text-start title">Usuarios </h2>
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
                    <Button className="button-Custom" onClick={handleButtonClick}>Agregar Usuario </Button>
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
                                fixedHeaderScrollHeight="77vh"
                                progressPending={loading}
                                onRowClicked={handleRowClick}
                                conditionalRowStyles={conditionalRowStyles}
                                paginationComponentOptions={customPaginationOptions}
                              
                                noDataComponent="No hay datos disponibles"
                                customStyles={customStyles}
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
    )
}
export default ListUsers;

