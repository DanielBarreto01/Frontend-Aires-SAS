import React from 'react';
import './CustomerSelection.css';
import "../../general.css";
import personNatu from "../../../assets/natu.png";
import personj from "../../../assets/juri.png";


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
                            src={ personNatu }
                            alt="Persona Natural"
                            className="customer-image"
                        />
                        <p>Persona Natural</p>
                    </div>

                    <div className="col-md-5 customer-option">
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
    );
};

export default CustomerSelection;