import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserDetails from '../userProfile/UserProfile';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import "../../TableStyle.css";
import RegisterUser from '../registerUser/RegisterUser';



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
    

    useEffect(() => {
        setTimeout(() => {
           setLoading(false);
            const token = localStorage.getItem('authToken');
            console.log("token", token);
            if (token !== null && jwtDecode(token).exp*1000 >  Date.now()) { // && jwtDecode(token).exp*1000 >  Date.now()
                fetchData();  
                setIsTokenChecked(true);
                setLoading(true);
               

            }else{
                localStorage.removeItem('authToken'); 
                setLoading(false);
                window.location.href = '/login';        
            }           
        }, 200);
        return () => clearTimeout();
       
    }, []);

    const handleButtonClick = () => {
        setIsNewComponentVisible(prevState => !prevState); // Cambia el estado para mostrar el nuevo componente
    };

    const fetchData = async () => {
        const backendUrl = process.env.REACT_APP_BCKEND;
        try {
            const config = {
                headers:{
                     "Content-Type": "application/json",
                     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
              
            };
            const response = await axios.get(`${backendUrl}${url}`,config);     
                setData(response.data);
                setRecords( response.data);
            setTimeout(() => {
                setLoading(false);
            }, 1500);
           
            return () => clearTimeout();

        } catch (error) {
            setLoading(false);
        }
    }
   
    const columns =[
        {
            name: 'Usuario',
            selector: row => row.pathImage, // Suponiendo que 'image' es el campo que contiene la URL de la imagen
            cell: row => (
              <img
                src={row.pathImage} // Suponiendo que 'image' es el campo que contiene la URL de la imagen
                alt="imagen"
                style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius:'80px'}} // Ajusta el tamaño según sea necesario
              />
            ),
          },
        {
            name:"Nombre",
            selector: row => `${row.name} ${row.lastName}`,
            sortable: true
        },

        {
            name:"Documento",
            selector: row => row.numberIdentification,
            sortable: true
        },
        {
            name:"Teléfono",
            selector: row => row.phoneNumber,
            sortable: true
        },
        {
            name:"Correo",
            selector: row => row.email,
            sortable: true
        }, 
        {
            name:"Estado",
            selector: row => row.userStatus === true ? "Activo" : "Inactivo",
            sortable: true
        }
    ]

    // useEffect(()=>{
    //     setTimeout(() => {
    //         fetchData();          
    //     }, 200);
    //     return () => clearTimeout();
    // },[]);

    const handleSelect = (eventKey) => {
        setLoading(true);
        setSelectedOption(eventKey);
        console.log("eventKey", eventKey);
        setTimeout(() => {  
            if(eventKey === "Seleccione un rol"){
                url = "/users/getUsers";
            }else{
                url = `/users/ShowUserRoles/${eventKey}`;
            }
           fetchData();          
        }, 200);
        return () => clearTimeout(); 
    };
   
    const handleChange = (e) => {
       setRecords(data.filter(record => {return record.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                                            `${record.name} ${record.lastName}`.toLowerCase().includes(e.target.value.toLowerCase()) ||
                                            record.lastName.toLowerCase().includes(e.target.value.toLowerCase()) ||
                                            record.numberIdentification.includes(e.target.value) ||
                                            record.phoneNumber.toString().includes(e.target.value) ||
                                            record.email.toLowerCase().includes(e.target.value.toLowerCase())}));
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

    if (!isTokenChecked) {   
        return null;  
    }  

    return (  
        isUserDetailsVisible ? (
            <UserDetails user={selectedUser} /> // Componente para mostrar los detalles del usuario seleccionado
        ) : isNewComponentVisible ? (
            <RegisterUser />
        ) : (
            <div className="General-Table flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 mt-2">
                <div > 
                {/* className="justify-content-center aling-items-center d-flex shadow-lg" */}
                    <div className="superior row justify-content-right aling-items-right d-flex shadow-lg ">
                        <div className='heder-comp'> 
                            <div className='title'><h2>Usuarios</h2></div>
                        </div>           
                        <div className="filter-bu  mb-4">
                        
                        
                            <form style={{ display: 'flex', width: '100%' }}>
                                <div className='input-container'>
                                    <FontAwesomeIcon icon={faSearch} className="icon" style={{ marginLeft: '10px' }} />
                                    <input className="form-control items-right" 
                                        placeholder="Buscar por: Nombre, Documento, Teléfono o Correo"
                                        type="search"                    
                                        onChange={handleChange}
                                        style={{ border: 'none', marginLeft: '-12px',  marginRight: '2px'  }}
                                        />
                        
                                </div>
                                
                                    
                            </form>
                            <div className = "desplegable">
                                <DropdownButton title={selectedOption} onSelect={handleSelect} className='selec-option' style={{ fontSize:'5px'}}>
                                    <Dropdown.Item eventKey="Seleccione un rol" className="dropdown-item-light">Seleccione un rol</Dropdown.Item>
                                    <Dropdown.Item eventKey="Administrador">Administrador</Dropdown.Item>
                                    <Dropdown.Item eventKey="Tecnico interno">Tecnico interno</Dropdown.Item>
                                    <Dropdown.Item eventKey="Tecnico externo">Tecnico externo</Dropdown.Item>
                                </DropdownButton>
                            </div>
                            <Button className = "button-Create"variant="primary" onClick={handleButtonClick}>Agregar usuario</Button>
                           
                        </div> 
                    
                    </div>
                
                
                
                    <div className="space-y-4"style={{ backgroundColor: '#fff' }}>
                        <div className="table-container">
                        <DataTable
                            columns={columns}
                            data = {records}
                            pagination
                            paginationPerPage={6}
                            fixedHeader
                            persistTableHead
                            fixedHeaderScrollHeight = "70vh"
                            progressPending={loading}
                            onRowClicked = {handleRowClick}
                            conditionalRowStyles={conditionalRowStyles}
                            progressComponent={( // Si está cargando, muestra el overlay y el spinner
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
}
export default ListUsers;

