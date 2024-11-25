import React, { useEffect, useState, useCallback } from "react";
import { Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import "./ListClients.css"; // Archivo CSS para estilos
import { Button, Spinner } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { getClients, getClientsActive } from "../../../api/ClientService";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import "../../general.css";
import "../../user/listUsers/ListUsers.css";

const ListClients = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const requestMaintenance = location.state?.requestMaintenance;
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedOption, setSelectedOption] = useState("Type person");
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [isTokenChecked, setIsTokenChecked] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const path = location.pathname

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        let response = [];
        try {
            if (location.pathname.includes('/admin/requestMaintenance/clients')) {
                response = await getClientsActive(token);
            } else {
                response = await getClients(token);
            }
            setData(response);
            setRecords(response);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }, [location.pathname]);

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

    }, [location.state, fetchData]);





    const handleChange = (e) => {
        setSearchText(e.target.value);
        setRecords(data.filter(record => {
            if (record.clientType === 'NaturalPerson') {
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

    const handleGoBack = () => {
        if (path.includes('requestMaintenance/requestMaintenance')) {
            navigate('/admin/requestMaintenance', { state: { key: new Date() } });
            return
        }
        navigate(-1);

    }

    // console.log("locationxxxxx", location.pathname);
    // const validateEquipmentClientSelectionList = location.pathname === '/admin/clients/update/equipmentClientSelectionList';
    // const validateRegister = location.pathname === '/admin/clients/CustomerSelection/register';
    // const isCustomerSelection = location.pathname === '/admin/clients/CustomerSelection';
    // const isUpdateClient = location.pathname === '/admin/clients/update';
    const isUpdateClient = location.pathname.includes('/admin/clients/') || location.pathname.includes('/admin/requestMaintenance/clients/') || location.pathname.includes('registerRequestMaintenance');
    // const validateRegisterRequestMaintenance = location.pathname === '/admin/requestMaintenance/clients/registerRequestMaintenance';
    // if (isCustomerSelection || isUpdateClient || validateEquipmentClientSelectionList || validateRegister || validateRegisterRequestMaintenance) {
    //     console.log("entra", location.pathname);
    //     return <Outlet />;
    // }

    if (isUpdateClient) {
        return <Outlet />;
    }

    const handleItemClick = (client) => {
        if (path.includes('/requestMaintenance/updateRequestMaintenance')) {
            navigate('/admin/requestMaintenance/updateRequestMaintenance', { state: { newClient: client, requestMaintenance } });

            return
        } else if (path.includes('/admin/clients')) {
            navigate('/admin/clients/update', {
                state: { client }
            });
            return;
        }
        navigate('/admin/requestMaintenance/clients/registerRequestMaintenance', { state: { client } });


    };



    if (!isTokenChecked) {
        return null;
    }


    return (
        <div className='row clients-l' >
            <div
                className={`col-12 ${location.pathname.includes('/requestMaintenance') ? 'col-lg-6' : 'col-lg-4'} title1`}>

                {(path.includes('requestMaintenance') ?
                    <h2 className="text-start title">Seleccionar Cliente</h2>
                    : <h2 className="text-start title">Clientes</h2>)}
            </div>

            <div className='col-6 col-lg-4 ' >
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

            <div className='col-6 col-md-2' >
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

            {location.pathname.includes('/requestMaintenance') ?
                (<div > </div>)
                : (<div className='col-12 col-lg-2' >
                    <Button className="button-Custom" onClick={handleNavigateToCustomerSelection}>Agregar Cliente</Button>
                </div>)}


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


            {/* <div className="col-lg-6"  style={{backgroundColor:'red'}}></div> */}
            {/* <div  ></div> */}

            {/* <div className='col-12 col-sm-3 col-md-2' style={{ backgroundColor: 'yellow' }}>
                {location.pathname.includes('/requestMaintenance') ?
                    (

                        <button className="button-confirmationn" onClick={handleGoBack}>
                            Regresar
                        </button>)

                    : (<button className="button-confirmationn" onClick={handleNavigateToCustomerSelection}>
                        Agregar Cliente
                    </button>)}


            </div> */}

            <div className="col-lg-10"></div>


            {location.pathname.includes('/requestMaintenance') ?
                (
                    <div className='col-lg-2 button-group  '>
                        <button className="button-Custom" onClick={handleGoBack}>
                            Regresar
                        </button>
                    </div>
                )
                : (
                    <div></div>

                )}




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