import React, { useEffect, useState } from "react";
import { Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import "./ListClients.css"; // Archivo CSS para estilos
import { Button, Spinner } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import UpdateClient from "../updateClient/UpdateClient";
import RegisterClient from "../registerClient/registerClient";
import { getClients } from "../../../api/ClientService";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import "../../general.css";
import "../../user/listUsers/ListUsers.css";

const ListClients = () => {
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState("Seleccione un rol");
    const [loading, setLoading] = useState(false);
    const [isNewComponentVisible, setIsNewComponentVisible] = useState(false);
    const [records, setRecords] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isTokenChecked, setIsTokenChecked] = useState(false);
    const [search, setSearch] = useState("name");
    const navigate = useNavigate();
    const location = useLocation();

    const roleMap = {
        "ADMIN": "Administrador",
        "INTERNAL_TECHNICIAN": "Técnico interno",
        "EXTERNAL_TECHNICIAN": "Técnico externo"
    };
    const [selectedId, setSelectedId] = useState(null);

    // const locations = [
    //     { id: 1, city: "Manchester", country: "UK", imageUrl: "https://trivo.com.ec/wp-content/uploads/2024/01/edificios-modernos.jpg"},
    //     { id: 2, city: "Yorkshire", country: "UK", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-bmWuYOI_RewtFu86U4XhbMGYg6qAjU631A&s" },
    //     { id: 3, city: "Hull", country: "UK", imageUrl: "ruta/de/imagen3.jpg" },
    //     { id: 4, city: "Leicester", country: "UK", imageUrl: "ruta/de/imagen4.jpg" },
    //     { id: 5, city: "Hull", country: "UK", imageUrl: "ruta/de/imagen3.jpg" },
    //     { id: 6, city: "Leicester", country: "UK", imageUrl: "ruta/de/imagen4.jpg" },
    //     { id: 7, city: "Hull", country: "UK", imageUrl: "ruta/de/imagen3.jpg" },
    //     { id: 8, city: "Leicester", country: "UK", imageUrl: "ruta/de/imagen4.jpg" },
    //     { id: 9, city: "Hull", country: "UK", imageUrl: "ruta/de/imagen3.jpg" },
    //     { id: 10, city: "Leicester", country: "UK", imageUrl: "ruta/de/imagen4.jpg" },
    //     { id: 11, city: "Hull", country: "UK", imageUrl: "ruta/de/imagen3.jpg" },
    //     { id: 12, city: "Leicester", country: "UK", imageUrl: "ruta/de/imagen4.jpg" },
    //     { id: 13, city: "Hull", country: "UK", imageUrl: "ruta/de/imagen3.jpg" },
    //     { id: 14, city: "Leicester", country: "UK", imageUrl: "ruta/de/imagen4.jpg" },
    //     { id: 15, city: "Hull", country: "UK", imageUrl: "ruta/de/imagen3.jpg" },
    //     { id: 16, city: "Leicester", country: "UK", imageUrl: "ruta/de/imagen4.jpg" },
    //     { id: 17, city: "Hull", country: "UK", imageUrl: "ruta/de/imagen3.jpg" },
    //     { id: 18, city: "Leicester", country: "UK", imageUrl: "ruta/de/imagen4.jpg" },
    //     { id: 19, city: "Leicester", country: "UK", imageUrl: "ruta/de/imagen4.jpg" },
    //     { id: 20, city: "Hull", country: "UK", imageUrl: "ruta/de/imagen3.jpg" },
    //     { id: 43, city: "Leicester", country: "UK", imageUrl: "ruta/de/imagen4.jpg" },
    //     { id: 38, city: "Hull", country: "UK", imageUrl: "ruta/de/imagen3.jpg" },
    //     { id: 401, city: "Leicester", country: "UK", imageUrl: "ruta/de/imagen4.jpg" },
    //     { id: 301, city: "Hull", country: "UK", imageUrl: "ruta/de/imagen3.jpg" },
    //     { id: 40015, city: "Leicester", country: "UK", imageUrl: "ruta/de/imagen4.jpg" },
    //     { id: 489, city: "Leicester", country: "UK", imageUrl: "ruta/de/imagen4.jpg" },
    //     { id: 3963, city: "Hull", country: "UK", imageUrl: "ruta/de/imagen3.jpg" },
    //     { id: 4207, city: "Leicester", country: "UK", imageUrl: "ruta/de/imagen4.jpg" },
    //     { id: 30263, city: "Hull", country: "UK", imageUrl: "ruta/de/imagen3.jpg" },
    //     { id: 42145, city: "Leicester", country: "UK", imageUrl: "ruta/de/imagen4.jpg" },
    //     { id: 32014, city: "Hull", country: "UK", imageUrl: "ruta/de/imagen3.jpg" },
    //     { id: 423524, city: "Leicester", country: "UK", imageUrl: "ruta/de/imagen4.jpg" },
    //     // Agrega más ubicaciones si es necesario
    // ];

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

    }, [location.state]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await getClients(token);
            console.log("respuesta equpos", response);
            setData(response);
            setRecords(response);
            setLoading(false);

        } catch (error) {
            setLoading(false);
        }
    };



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
            if(record.clientType ==='NaturalPerson') {
                return record.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    record.lastName.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    `${record.name} ${record.lastName}`.toLowerCase().includes(e.target.value.toLowerCase()) ||  
                    record.numberIdentification.toString().includes(e.target.value) 
            } else {
                return record.nameCompany.toLowerCase().includes(e.target.value.toLowerCase()) ||
                record.numberIdentificationCompany.toString().includes(e.target.value)
            }
               
        }));
    }


    const handleNavigateToCustomerSelection = () => {
        navigate('/admin/clients/CustomerSelection');
    };

    const isCustomerSelection = location.pathname === '/admin/clients/CustomerSelection';
    const isUpdateClient = location.pathname === '/admin/clients/update';
    if (isCustomerSelection || isUpdateClient) {
        return <Outlet />;
    }

    const handleItemClick = (client) => {
        navigate('/admin/clients/update' ,{
            state: {client}    
        });
       
       //isCustomerSelection = location.pathname === '/admin/clients/update';
        // setSelectedClient(location);
        // console.log(location, " muestra la seleccion")
        // setIsClientDetailsVisible(true)
    };


    // let isCustomerSelectinonn = location.pathname === '/admin/clients/update';



    if (!isTokenChecked) {
        return null;
    }
  


  

    return (
        isNewComponentVisible ? (
            <RegisterClient />
        ) : (
            <div className='row'>
                <div className='col-12 col-md-4 title1'>
                    <h2 className="text-start title">Clientes </h2>
                </div>

                <div className='col-6 col-sm-6 col-md-4 ' >
                    <form >
                        <div className='input-container'>
                            <FontAwesomeIcon icon={faSearch} className="icon" />
                            <input className="form-control input-style"
                                placeholder="Buscar por nombre o numero de identificación"
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
                                    <option value="Seleccione un rol">tipo persona</option>
                                    <option value="Administrador">Natural</option>
                                    <option value="Tecnico interno">Jurídica</option>
                                </Form.Control>
                                <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
                            </div>
                        </Form.Group>
                    </Form>

                </div>

                <div className='col-12 col-sm-3 col-md-2' >
                <Button className="button-Custom" onClick={handleNavigateToCustomerSelection}>Agregar Cliente</Button>

                </div>
                <div className='col-12 gallery-scroll-container'>
                    <div className="space-y-4">
                        <div className="gallery-container">
                            {records.map((records) => (
                                <div key={records.id} className="gallery-item">
                                    <div
                                        key={records.id}
                                        className={`gallery-item ${selectedId === records.id ? 'selected' : ''}`}
                                        onClick={() => handleItemClick(records)}
                                    >
                                        {records.pathImage ? (
                                            <img src={records.pathImage} alt={records.name} />
                                        ) : (
                                            <div className="placeholder">No Image Available</div>
                                        )}
                                       <p>{`${records.name || ''} ${records.lastName || ''}`.trim() || records.nameCompany}</p> 
                                        {/* <p>{records.name || records.nameCompany}</p> */}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
                {loading && (
                    <div className="loading-overlay">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </Spinner>
                    </div>
                )}
            </div>
            
        )
    );
};

export default ListClients;