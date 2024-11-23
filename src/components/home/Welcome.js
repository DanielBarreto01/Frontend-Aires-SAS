import React, { useState,useEffect } from 'react';
import './Welcome.css';
import "../../components/general.css";
import {getUsersWithoutAdminRole} from "../../api/UserService";
import {getClientsActive} from "../../api/ClientService";
import {getEquipments} from "../../api/EquipmentService";
import {getRequestMaintenace} from "../../api/MaintenanceService"; 

const Welcome = () => {


    const [UserActive, setVariable] = useState(0);
    const [clients, setClients] = useState(0);
    const [equipments, setEquipments] = useState(0);
    const [requests, setRequests] = useState(0);

    useEffect(() => {
        fetchData();

    }, []);

    const fetchData = async () => {
        try {

            const responseClients = await getClientsActive(localStorage.getItem('authToken'));
            setClients(responseClients.length);

            const responseEquipments = await getEquipments(localStorage.getItem('authToken'));
            setEquipments(responseEquipments.length);

            const responseRequests = await getRequestMaintenace(localStorage.getItem('authToken'));
            setRequests(responseRequests.data.length);

            const response = await getUsersWithoutAdminRole(localStorage.getItem('authToken'));
            setVariable(response.data.length);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="customer-selection-container ">
            <div className="customer-selection-container ">
                <div className="content-wrapper">
                    <h1 className="header ">Sistema de Gestión de Mantenimiento</h1>
                    <p className="text-muted">Bienvenido al panel de control</p>

                    <div className="row my-4" >
                    <div className="col-lg-1"> </div>

                        <div className=" col-md-6 col-lg-2 ">
                            <div className="card-summary">
                                <h5>Solicitudes Totales</h5>
                                <p>{requests}</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-2">
                            <div className="card-summary">
                                <h5>Solicitudes Pendientes</h5>
                                <p>45</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-2">
                            <div className="card-summary" style={{paddingTop:''}}>
                                <h5>Técnicos Activos</h5>
                                <p>{UserActive}</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-2 ">
                            <div className="card-summary">
                                <h5>Clientes Activos</h5>
                                <p>{clients}</p>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-2">
                            <div className="card-summary">
                                <h5>Equipos Registrados</h5>
                                <p>{equipments}</p>
                            </div>
                        </div>
                    </div>

                    <div className="requests-list">
                        <div className="request-item">
                            <span>Reparación de aire acondicionado (Oficina 302)</span>
                            <span className="status pending">Pendiente</span>
                        </div>
                        <div className="request-item">
                            <span>Cambio de bombillas (Pasillo principal)</span>
                            <span className="status in-progress">En progreso</span>
                        </div>
                        <div className="request-item">
                            <span>Fuga de agua en baño (Baño 2do piso)</span>
                            <span className="status completed">Completada</span>
                        </div>
                        <div className="request-item">
                            <span>Fuga de agua en baño (Baño 2do piso)</span>
                            <span className="status completed">Completada</span>
                        </div>
                        <div className="request-item">
                            <span>Fuga de agua en baño (Baño 2do piso)</span>
                            <span className="status completed">Completada</span>
                        </div>
                        <div className="request-item">
                            <span>Fuga de agua en baño (Baño 2do piso)</span>
                            <span className="status completed">Completada</span>
                        </div>
                        <div className="request-item">
                            <span>Fuga de agua en baño (Baño 2do piso)</span>
                            <span className="status completed">Completada</span>
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;