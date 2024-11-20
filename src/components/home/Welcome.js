import React, { useState } from 'react';
import './Welcome.css';
import "../../components/general.css";
import personNatu from "../../assets/natu.png";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const Welcome = () => {
    const [clientType, setClientType] = useState(false);
    const [clientTypeSelected, setClientTypeSelected] = useState('');

    const handleClientTypeSelection = (clientType) => {
        setClientType(true);
        setClientTypeSelected(clientType);
    };

    return (
        <div className="customer-selection-container d-flex align-items-center justify-content-center">
            <div className="content-wrapper text-center">
                <div className="col-12">
                    <h1 className="header">Bienvenido al Panel de Administración</h1>
                    <p className="text-muted mt-2">Gestión de Solicitudes de Mantenimiento</p>
                </div>
                <div className="row justify-content-around mt-4">
                    <div className="col-md-3 customer-option" onClick={() => handleClientTypeSelection('usuarios')}>
                        <img
                            src={personNatu} // Reemplaza 'userIcon' con la ruta de tu ícono para "Usuarios"
                            alt="Gestionar Usuarios"
                            className="customer-image"
                        />
                        <p className="text-primary">Gestionar Usuarios</p>
                    </div>
                    <div className="col-md-3 customer-option" onClick={() => handleClientTypeSelection('clientes')}>
                        <img
                            src={personNatu} // Reemplaza 'clientIcon' con la ruta de tu ícono para "Clientes"
                            alt="Gestionar Clientes"
                            className="customer-image"
                        />
                        <p className="text-primary">Gestionar Clientes</p>
                    </div>
                    <div className="col-md-3 customer-option" onClick={() => handleClientTypeSelection('equipos')}>
                        <img
                            src={personNatu} // Reemplaza 'equipmentIcon' con la ruta de tu ícono para "Equipos"
                            alt="Gestionar Equipos"
                            className="customer-image"
                        />
                        <p className="text-primary">Gestionar Equipos</p>
                    </div>
                    <div className="col-md-3 customer-option" onClick={() => handleClientTypeSelection('mantenimiento')}>
                        <img
                            src={personNatu} // Reemplaza 'maintenanceIcon' con la ruta de tu ícono para "Mantenimiento"
                            alt="Gestionar Mantenimiento"
                            className="customer-image"
                        />
                        <p className="text-primary">Gestionar Mantenimiento</p>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-md-6">
                        <div className="card">
                            <h5 className="card-header">Misión</h5>
                            <div className="card-body">
                                <p>
                                    Nuestra misión es proporcionar soluciones de mantenimiento eficientes y efectivas,
                                    garantizando la satisfacción del cliente y la optimización de recursos.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <h5 className="card-header">Visión</h5>
                            <div className="card-body">
                                <p>
                                    Ser líderes en la industria de mantenimiento, reconocidos por nuestra innovación,
                                    calidad de servicio y compromiso con la excelencia operativa.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;