import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons'; // Importa el icono 'list'
import { library } from '@fortawesome/fontawesome-svg-core';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import "../TableStyle.css";

library.add(faList);

function ListUsers() {
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState("Seleccione un rol");
    const[loading, setLoading] = useState(true);
    const [records, setRecords] = useState([]);
    let url = "/users/getUsers";  
    const [isTokenChecked, setIsTokenChecked] = useState(false);

    useEffect(() => {
        setTimeout(() => {
              // Mostrar el spinner
            const token = localStorage.getItem('authToken');
            console.log("token", token);
            if (token !== null) {
                fetchData();  
                setIsTokenChecked(true);
                setLoading(true);
               
            }else{
                setLoading(false);
                window.location.href = '/login';        
            }
                   
        }, 200);
        return () => clearTimeout();
       
    }, []);

    const fetchData = async () => {
        const backendUrl = process.env.REACT_APP_BCKEND;
        try {
            const config = {
                headers:{
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
            name:"Usuario"
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
    if(isTokenChecked === false){
        return null;
    }

    return (  
    <div className="General-Table flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 mt-2">
        <div > 
        {/* className="justify-content-center aling-items-center d-flex shadow-lg" */}
            <div className="superior row justify-content-right aling-items-right d-flex shadow-lg ">
                <div className='heder-comp'> 
                    <div className='title'><h2>Clientes</h2></div>
                </div>           
                <div className="filter-bu items-left align-items-left mb-4">
                    <div className="items-right align-items-right ">
                        <form>
                            <input className="form-control items-right" 
                                placeholder="Buscar por: Nombre, Documento, Teléfono o Correo"
                                type="search"                    
                                onChange={handleChange}
                                />
                        </form>
                    </div>
                    <Button className = "button-Create"variant="primary">Agregar Usuario</Button>
                    <div className = "desplegable">
                        <DropdownButton title={selectedOption} onSelect={handleSelect}>
                            <Dropdown.Item eventKey="Seleccione un rol" className="dropdown-item-light">Seleccione un rol</Dropdown.Item>
                            <Dropdown.Item eventKey="Administrador">Administrador</Dropdown.Item>
                            <Dropdown.Item eventKey="Tecnico interno">Tecnico interno</Dropdown.Item>
                            <Dropdown.Item eventKey="Tecnico externo">Tecnico externo</Dropdown.Item>
                        </DropdownButton>
                    </div>
                </div> 
               
            </div>
           
           
          
            <div className="space-y-4">
                <div className="table-container border shadow-sm rounded">
                  <DataTable
                    columns={columns}
                    data = {records}
                    pagination
                    paginationPerPage={6}
                    fixedHeader
                    persistTableHead
                    fixedHeaderScrollHeight = "70vh"
                    progressPending={loading}
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

    );
}
export default ListUsers;

