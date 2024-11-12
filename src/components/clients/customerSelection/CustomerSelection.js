import React from 'react';
import './CustomerSelection.css';
import { Row, Col } from "react-bootstrap";
import "../../general.css";

const CustomerSelection = () => {
    return (
        <div className="customer-selection-container d-flex align-items-center justify-content-center">


            <div className="content-wrapper text-center">
                <div className="col-12 " >
                   <h1 className="header">Elige el tipo de cliente que vas a registrar </h1>
                </div>

                <div className="row justify-content-around mt-4">

                    <div className="col-md-5 customer-option">
                        <img
                            src="ruta-a-la-imagen-persona-natural.jpg"
                            alt="Persona Natural"
                            className="customer-image"
                        />
                        <p>Persona Natural</p>
                    </div>

                    <div className="col-md-5 customer-option">
                        <img
                            src="ruta-a-la-imagen-persona-juridica.jpg"
                            alt="Persona Jurídica"
                            className="customer-image"
                        />
                        <p>Persona Jurídica</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSelection;