import React, { useState } from 'react';
import './CustomerSelection.css';
import "../../general.css";
import personNatu from "../../../assets/natu.png";
import personj from "../../../assets/juri.png";
import RegisterClient from '../registerClient/registerClient';





const CustomerSelection = () => {

    const [clientType, setClientType] = useState(false);
    const [clientTypeSelected, setClientTypeSelected] = useState('');
    const handleClientTypeSelection = (clientType) => {
        setClientType(true) 
        setClientTypeSelected(clientType)
    }


        return (
        clientType ? (
            <RegisterClient clientType={clientTypeSelected} />
        ) : (
            <div className="customer-selection-container d-flex align-items-center justify-content-center">
                <div className="content-wrapper text-center">
                    <div className="col-12">
                        <h1 className="header">Elige el tipo de cliente que vas a registrar</h1>
                    </div>
                    <div className="row justify-content-around mt-4">
                        <div className="col-md-5 customer-option" onClick={() => handleClientTypeSelection('natural')}>
                            <img
                                 src={ personNatu }
                                alt="Persona Natural"
                                className="customer-image"
                            />
                            <p>Persona Natural</p>
                        </div>
                        <div className="col-md-5 customer-option" onClick={() => handleClientTypeSelection('juridica')}>
                            <img
                                src={personj}
                                alt="Persona Jurídica"
                                className="customer-image"
                            />
                            <p>Persona Jurídica</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}
export default CustomerSelection;