import React, { useEffect, useState } from "react";
import { Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import "./ListEquipments.css"; // Archivo CSS para estilos
import DataTable from 'react-data-table-component';
import { Button, Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
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

    const [isOpen, setIsOpen] = useState(false);

    const handleDropdownToggle = () => {
        setIsOpen(!isOpen);
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

                    <Form>
                        <Form.Group controlId="rolesPro" className="dropdown">
                            <div className="dropdown-container">
                                <Form.Control
                                    as="select"
                                    name="roles"
                                    value={selectedOption} // Valor actual del select
                                    // onChange={handleRoleChange}
                                    required
                                    onClick={handleDropdownToggle}
                                    style={{ border: 'none' }}
                                >
                                    <option value="Seleccione un rol">Tipo de Equipo</option>
                                    <option value="Administrador">Condensador</option>
                                    <option value="Tecnico interno">Cassette Inventer y On-Off </option>
                                    <option value="Tecnico externo">Condensador</option>
                                </Form.Control>
                                <FontAwesomeIcon
                                    icon={isOpen ? faChevronUp : faChevronDown}
                                    className="icon "
                                />
                            </div>
                        </Form.Group>




                    </Form>

                </div>

                <div className='col-12 col-sm-3 col-md-2'  >
                    <Button className="button-Custom" onClick={handleButtonClick} >Agregar equipo</Button>
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
                                fixedHeaderScrollHeight="77vh"
                                progressPending={loading}
                                onRowClicked={handleRowClick}
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





            </div>


        )
    );
};

export default ListEquipments;