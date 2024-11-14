import React, {useEffect, useState} from "react";
import { Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import "./ListEquipments.css"; // Archivo CSS para estilos
import DataTable from 'react-data-table-component';
import { Button, Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import {faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { getEquipments } from "../../../api/EquipmentService"
import RegisterEquipment from "../registerEquipments/RegisterEquipment";
import UpdateEquipment from "../updateEquipments/UpdateEquipment";

import { useNavigate, Outlet } from 'react-router-dom';

import "../../general.css";
import "../../user/listUsers/ListUsers.css";

const ListEquipments = () => {
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState("Seleccione un rol");
    const [loading, setLoading] = useState(false);
    const [isNewComponentVisible, setIsNewComponentVisible] = useState(false);
    const [records, setRecords] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [isTokenChecked, setIsTokenChecked] = useState(false);
    const [isEquipmentDetailsVisible, setIsEquipmentDetailsVisible] = useState(false);
    const [search, setSearch] = useState("name");
    const navigate = useNavigate();

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

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await getEquipments(token);
            console.log("respuesta equpos", response);
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
        // {
        //     name: 'Id',
        //     selector: row => row.id,
        //     sortable: true,
        //     center: true.toString()
           
        // },
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

    const handleChange = (e) => {
        setRecords(data.filter(record => {
            // if (search === "name") {
            //     return `${record.name} ${record.lastName}`.toLowerCase().includes(e.target.value.toLowerCase()) ||
            //     record.lastName.toLowerCase().includes(e.target.value.toLowerCase()) ||
            //     record.name.toLowerCase().includes(e.target.value.toLowerCase());
            // } else if (search === "document") {
            //     return record.numberIdentification.includes(e.target.value);
            // } else if (search === "phone") {
            //     return record.phoneNumber.toString().includes(e.target.value);
            // }else if (search === "email") {
            //     return record.email.toLowerCase().includes(e.target.value.toLowerCase());
            // }
            // return null;
            return record.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                record.id.toString().includes(e.target.value.toLowerCase()) ||
                record.brand.toLowerCase().includes(e.target.value.toLowerCase()) ||
                record.modelNumber.toLowerCase().includes(e.target.value) ||
                record.serialNumber.toLowerCase().includes(e.target.value) ||
                record.iventoryNumber.toString().includes(e.target.value.toLowerCase())
        }));
    }

    const handleButtonClick = () => {
        setIsNewComponentVisible(prevState => !prevState); // Cambia el estado para mostrar el nuevo componente
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


    const handleRowClick = (row) => {
       // setLoading(true);
        setSelectedEquipment(row);
        //console.log(row);  // Guarda la información de la fila seleccionada
        setIsEquipmentDetailsVisible(true);
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
        isEquipmentDetailsVisible ? (
            <UpdateEquipment equipment={selectedEquipment} />
        ) : isNewComponentVisible ? (
            <RegisterEquipment />
        ) : (
            <div className='row'>
                <div className='col-12 col-md-4 title1'>
                    <h2 className="text-start title">Equipos </h2>
                </div>

                <div className='col-6 col-sm-6 col-md-4 ' >
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

                <div className='col-6 col-sm-3 col-md-2' >


                    {/* <div className="desplegable">
                        <DropdownButton title={selectedOption} onSelect={handleSelect}>
                            <Dropdown.Item eventKey="Seleccione un rol" className="dropdown-item-light">Seleccionee un rol</Dropdown.Item>
                            <Dropdown.Item eventKey="Administrador">Administrador</Dropdown.Item>
                            <Dropdown.Item eventKey="Tecnico interno">Tecnico interno</Dropdown.Item>
                            <Dropdown.Item eventKey="Tecnico externo">Tecnico externo</Dropdown.Item>
                        </DropdownButton>
                    </div> */}
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


                        {/* <Form.Group controlId="search" className="dropdownSearch"> 
                            <div className="dropdown-container">
                                <Form.Control
                                    as="select"
                                    name="search"
                                    value={search} 
                                    onChange={handleSearchInput}
                                    required
                                    style={{ border: 'none' }}
                                >
                                    <option value="name">Nombre</option>
                                    <option value="document">Documento</option>
                                    <option value="phone">Telefono</option>
                                    <option value="email">Correo</option>
                                </Form.Control>
                                <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
                            </div>
                        </Form.Group>*/}

                    </Form>

                </div>

                <div className='col-12 col-sm-3 col-md-2' >
                    <Button className="button-Custom"  onClick={handleButtonClick} >Agregar equipo</Button>
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
    );
};

export default ListEquipments;