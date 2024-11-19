import React, { useEffect, useState } from "react";
import { Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import "./ListClients.css"; // Archivo CSS para estilos
import { Button, Spinner } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { getClients } from "../../../api/ClientService";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import "../../general.css";
import "../../user/listUsers/ListUsers.css";

const ListClients = () => {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedOption, setSelectedOption] = useState("Type person");
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [isTokenChecked, setIsTokenChecked] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedId, setSelectedId] = useState(null);

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
        setSearchText(e.target.value);
        setRecords(data.filter(record => {
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
    const handleRoleChange = (e) => {
        setSearchText('');
        setSelectedOption(e.target.value);
        if (e.target.value === 'Type person') {
            setRecords(data);
        } else if (e.target.value === 'natural') {
            setRecords(data.filter(record => record.clientType === 'NaturalPerson'));
        } else if (e.target.value === 'juridical') {
            setRecords(data.filter(record => record.clientType === 'JuridicalPersons'));
        }
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
    };



    if (!isTokenChecked) {
        return null;
    }
  


  

    return (
        
            <div className='row'>
                <div className='col-12 col-md-4 title1'>
                    <h2 className="text-start title">Clientes </h2>
                </div>

                <div className='col-6 col-sm-6 col-md-4 ' >
                    <form >
                        <div className='input-container'>
                            <FontAwesomeIcon icon={faSearch} className="icon" />
                            <input className="form-control input-style"
                                placeholder="Buscar por nombre o identificación"
                                type="search"
                                value={searchText}
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
                                    onChange={handleRoleChange}
                                    required
                                    style={{ border: 'none' }}
                                >
                                    <option value="Type person">Tipo persona</option>
                                    <option value="natural">Natural</option>
                                    <option value="juridical">Jurídica</option>
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
            
        
    );
};

export default ListClients;