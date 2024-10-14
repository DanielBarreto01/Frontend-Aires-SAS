import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons'; // Importa el icono 'list'
import { library } from '@fortawesome/fontawesome-svg-core';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import "../TableStyle.css";

library.add(faList);

function ListUsers() {
    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState("Acción 1");
   
    const fetchData = async () => {
        const backendUrl = process.env.REACT_APP_BCKEND;
        if (!backendUrl) {
            console.error('REACT_APP_BCKEND está indefinido');
            return;
        }

        try {
            const config = {
                headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqdWFubWFyMTgwMSIsImlkIjoxODAyLCJuYW1lIjoiSnVhbiIsImxhc3ROYW1lIjoiTWFydGluZXoiLCJ0eXBlSWRlbnRpZmljYXRpb24iOiJDQyIsIm51bWJlcklkZW50aWZpY2F0aW9uIjoiMTAwMzkxMjg2MSIsImVtYWlsIjoiam9zZTIzMTEwMWFAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOjMxMjQ3NTgyNDk2LCJyb2xlcyI6WyJBRE1JTiJdLCJpYXQiOjE3Mjg3OTc3MzAsImV4cCI6MTcyODgwMTMzMH0.D4Q7r0Nr3JTw3OEI96UKZoFn8FsCohKAE0hq41FNEbM'  },
            };

            const response = await axios.get(`${backendUrl}/users/getUsers`,config);
            setData(response.data);
            console.log("lista de turnos:", response.data)


            console.log("respuetsa tabla de turnos :", response);
        } catch (error) {
            console.error('Error al cargar los datos', error);
        }
    };

    const columns =[
        {
            name:"Usuario"
        },
        {
            name:"Nombre",
            selector: row => row.nombre,
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

    const dataUsers = [
        { nombre: "Juan", numberIdentification: "12369556789", phoneNumber: "123456789", email: "juan@example.com" },
        { nombre: "Camilo", numberIdentification: "13676789", phoneNumber: "987654321", email: "camilo@example.com" },
        { nombre: "Alexander", numberIdentification: "123456549", phoneNumber: "654987321", email: "alexander@example.com" },
        { nombre: "Daniel", numberIdentification: "234567891", phoneNumber: "321654987", email: "daniel@example.com" },
        { nombre: "Andrea", numberIdentification: "345678912", phoneNumber: "987321654", email: "andrea@example.com" },
        { nombre: "Luisa", numberIdentification: "456789123", phoneNumber: "123789654", email: "luisa@example.com" },
        { nombre: "Carolina", numberIdentification: "567891234", phoneNumber: "321987654", email: "carolina@example.com" },
        { nombre: "David", numberIdentification: "678912345", phoneNumber: "654321789", email: "david@example.com" },
        { nombre: "Miguel", numberIdentification: "789123456", phoneNumber: "789456123", email: "miguel@example.com" },
        { nombre: "Santiago", numberIdentification: "891234567", phoneNumber: "456789123", email: "santiago@example.com" },
        { nombre: "Valentina", numberIdentification: "912345678", phoneNumber: "789654321", email: "valentina@example.com" },
        { nombre: "Felipe", numberIdentification: "1023456789", phoneNumber: "123456123", email: "felipe@example.com" },
        { nombre: "Sofía", numberIdentification: "1123456789", phoneNumber: "654789321", email: "sofia@example.com" },
        { nombre: "Juliana", numberIdentification: "1223456789", phoneNumber: "987123654", email: "juliana@example.com" },
        { nombre: "Manuel", numberIdentification: "1323456789", phoneNumber: "321654123", email: "manuel@example.com" },
        { nombre: "Laura", numberIdentification: "1423456789", phoneNumber: "456123789", email: "laura@example.com" },
        { nombre: "Sebastián", numberIdentification: "1523456789", phoneNumber: "789321456", email: "sebastian@example.com" },
        { nombre: "Nicolás", numberIdentification: "1623456789", phoneNumber: "654987321", email: "nicolas@example.com" },
        { nombre: "Catalina", numberIdentification: "1723456789", phoneNumber: "987456123", email: "catalina@example.com" },
        { nombre: "Martín", numberIdentification: "1823456789", phoneNumber: "321789654", email: "martin@example.com" },
        { nombre: "Paula", numberIdentification: "1923456789", phoneNumber: "654123987", email: "paula@example.com" },
        { nombre: "Alejandro", numberIdentification: "2023456789", phoneNumber: "987321654", email: "alejandro@example.com" },
        { nombre: "María", numberIdentification: "2123456789", phoneNumber: "123654987", email: "maria@example.com" },
        { nombre: "Andrés", numberIdentification: "2223456789", phoneNumber: "654321987", email: "andres@example.com" },
        { nombre: "Isabel", numberIdentification: "2323456789", phoneNumber: "987123456", email: "isabel@example.com" },
        { nombre: "Tomás", numberIdentification: "2423456789", phoneNumber: "789654123", email: "tomas@example.com" },
        { nombre: "Gabriela", numberIdentification: "2523456789", phoneNumber: "456789654", email: "gabriela@example.com" },
        { nombre: "José", numberIdentification: "2623456789", phoneNumber: "123789654", email: "jose@example.com" },
        { nombre: "Renata", numberIdentification: "2723456789", phoneNumber: "654789123", email: "renata@example.com" },
        { nombre: "Simón", numberIdentification: "2823456789", phoneNumber: "987654123", email: "simon@example.com" },
        { nombre: "Cristina", numberIdentification: "2923456789", phoneNumber: "456123987", email: "cristina@example.com" },
        { nombre: "Samuel", numberIdentification: "3023456789", phoneNumber: "321987654", email: "samuel@example.com" },
        { nombre: "Daniela", numberIdentification: "3123456789", phoneNumber: "789321654", email: "daniela@example.com" },
        { nombre: "Pablo", numberIdentification: "3223456789", phoneNumber: "654123456", email: "pablo@example.com" },
        { nombre: "Natalia", numberIdentification: "3323456789", phoneNumber: "123654321", email: "natalia@example.com" },
        { nombre: "Gonzalo", numberIdentification: "3423456789", phoneNumber: "987456789", email: "gonzalo@example.com" },
        { nombre: "Liliana", numberIdentification: "3523456789", phoneNumber: "654987456", email: "liliana@example.com" },
        { nombre: "Rafael", numberIdentification: "3623456789", phoneNumber: "321456123", email: "rafael@example.com" },
        { nombre: "Sara", numberIdentification: "3723456789", phoneNumber: "789123654", email: "sara@example.com" },
        { nombre: "Iván", numberIdentification: "3823456789", phoneNumber: "654321123", email: "ivan@example.com" },
        { nombre: "Elena", numberIdentification: "3923456789", phoneNumber: "123456321", email: "elena@example.com" },
        { nombre: "Bruno", numberIdentification: "4023456789", phoneNumber: "987654789", email: "bruno@example.com" },
        { nombre: "Lucía", numberIdentification: "4123456789", phoneNumber: "654987789", email: "lucia@example.com" },
        { nombre: "Carlos", numberIdentification: "4223456789", phoneNumber: "321654789", email: "carlos@example.com" },
        { nombre: "Mónica", numberIdentification: "4323456789", phoneNumber: "123789321", email: "monica@example.com" },
        { nombre: "Javier", numberIdentification: "4423456789", phoneNumber: "987123789", email: "javier@example.com" },
        { nombre: "Victoria", numberIdentification: "4523456789", phoneNumber: "654321654", email: "victoria@example.com" },
        { nombre: "Enrique", numberIdentification: "4623456789", phoneNumber: "321456987", email: "enrique@example.com" },
        { nombre: "Claudia", numberIdentification: "4723456789", phoneNumber: "456789321", email: "claudia@example.com" }
    ];
    const [records, setRecords] = useState(dataUsers);

    const handleChange = (e) => {
       setRecords(dataUsers.filter(record => {return record.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
                                            record.numberIdentification.includes(e.target.value) ||
                                            record.phoneNumber.includes(e.target.value) ||
                                            record.email.toLowerCase().includes(e.target.value.toLowerCase())}));
       }
    const handleSelect = (eventKey) => {
        setSelectedOption(eventKey); // Actualiza la opción seleccionada
      };
    

    return (  
    <div className="General-Table flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 mt-2">
        <div > 
        {/* className="justify-content-center aling-items-center d-flex shadow-lg" */}
            <div className="superior row justify-content-right aling-items-right d-flex shadow-lg ">
                <div className='heder-comp'> 
                    <div className='title'><h2>Clientes</h2></div>
                    <div className="items-right align-items-right ">
                        <form>
                            <input className="form-control items-right" 
                                placeholder="Buscar por: Nombre, Documento, Teléfono o Correo"
                                type="search"                    
                                onChange={handleChange}
                                />
                        </form>
                    </div>
                </div>           
                <div className="filter-bu items-left align-items-left mb-4">
                    <Button className = "button-Create"variant="primary">Agregar Usuario</Button>
                    <div className = "desplegable">
                        <DropdownButton title={selectedOption} onSelect={handleSelect}>
                            <Dropdown.Item href="#/action-1">Acción 1</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Acción 2</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Acción 3</Dropdown.Item>
                        </DropdownButton>
                    </div>
                
                </div> 
               
            </div>
           
           
          
            <div className="space-y-4">
                <div class="table-container border shadow-sm rounded">
                  <DataTable
                    columns={columns}
                    data = {records}
                    pagination
                    paginationPerPage={6}
                    fixedHeader
                    persistTableHead
                    fixedHeaderScrollHeight = "70vh"
                  />
                    
                  
                </div>

            </div>
        </div>
    </div>

    );
}
export default ListUsers;

