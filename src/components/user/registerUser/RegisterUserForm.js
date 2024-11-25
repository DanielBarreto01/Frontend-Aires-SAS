import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";



import { Form, Button, Row, Col, Image, Spinner } from 'react-bootstrap';
import './RegisterUser.css';
// import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import ImageDropzone from '../../loadImage/ImageDropzone';
import "../../general.css";

function RegisterUserForm({ formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    getRootProps,
    getInputProps,
    isDragActive,
    image,
    loading,
    handleCancel,
    handleRegister,
    showModal,
    handleCloseModal,
    handleConfirmAction,
    isEditingButtons,
    modalType }) {

    const [dropdownState, setDropdownState] = useState({
        roles: false,
        typeIdentification: false,
    });

    const handleDropdownToggle = (controlId) => {
        setDropdownState((prevState) => ({
            ...prevState,
            [controlId]: !prevState[controlId] // Alterna el estado del dropdown correspondiente
        }));
    };


    return (

        <div className='row' >

            <div className='col-12 col-lg-6 title1 ' style={{ marginBottom: '15px' }}>
                <h2 className="text-start title">Registro de Usuario</h2>
            </div>



            <div className='col-12'>
                <div className='row'>

                    <div className='col-12 col-lg-6' >
                        <div className="image-coponent">
                            <ImageDropzone
                                getRootProps={getRootProps}
                                getInputProps={getInputProps}
                                isDragActive={isDragActive}
                                image={image}
                                defaultImage={''}

                            />
                        </div>


                        <div className='floating-label' >
                            <Form.Group controlId="roles" className="roles" >
                                <div className="icon-container">
                                    <Form.Control
                                        as="select"
                                        name="roles"
                                        value={formData.roles[0] || ''}
                                        onChange={(e) => {
                                            const selectedRole = e.target.value;
                                            setFormData({
                                                ...formData,
                                                roles: selectedRole ? [selectedRole] : [""]
                                            });
                                        }}
                                        required

                                        onClick={() => handleDropdownToggle("roles")}
                                    >
                                        <option value="" disabled>Selecione un rol</option>
                                        <option value="ADMIN">Administrador</option>
                                        <option value="INTERNAL_TECHNICIAN">Tecnico interno</option>
                                        <option value="EXTERNAL_TECHNICIAN">Tecnico externo</option>
                                    </Form.Control>

                                    <FontAwesomeIcon
                                        icon={dropdownState.roles ? faChevronUp : faChevronDown} // Ícono dinámico
                                        className="icon-selector"
                                    />
                                </div>
                            </Form.Group>

                        </div>



                    </div>



                    <div className="col-12 col-lg-6 form ">
                        <Form onSubmit={handleSubmit} >

                            <div className='row'>
                                <div className="floating-label col-12 ">
                                    <Form.Group controlId="name" className='nameUser'>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder=""
                                            required
                                            pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                                            maxLength={30}
                                            onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un nombre valido. No se permiten caracteres especiales ni números.')}
                                            onInput={(e) => e.target.setCustomValidity('')}
                                        />
                                        <Form.Label>Nombres</Form.Label>
                                    </Form.Group>
                                </div>



                                <div className="floating-label col-12  " >
                                    <Form.Group controlId="lastName" className='lastNameUser' >

                                        <Form.Control
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder=""
                                            required
                                            pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                                            maxLength={30}
                                            onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un apellido valido. No se permiten caracteres especiales ni números.')}
                                            onInput={(e) => e.target.setCustomValidity('')}

                                        />
                                        <Form.Label>Apellidos</Form.Label>
                                    </Form.Group>

                                </div>

                                <div className="col-12 col-lg-5" >
                                    <Form.Group controlId="typeIdentificationUser" className="typeIdentificationUser floating-label">
                                        <div className="icon-container">
                                            <Form.Control
                                                as="select"
                                                name="typeIdentification"
                                                value={formData.typeIdentification}
                                                onChange={handleInputChange}
                                                required
                                                style={{ border: 'none' }}
                                                onClick={() => handleDropdownToggle("typeIdentification")}

                                            >
                                                <option value="" disabled>Tipo de identificación</option>
                                                <option value="CC">Cédula de ciudadanía </option>
                                                <option value="CE">Cédula de extranjería</option>
                                                <option value="PA">Pasaporte</option>
                                            </Form.Control>

                                            <FontAwesomeIcon
                                                icon={!dropdownState.typeIdentification ? faChevronDown : faChevronUp} // Ícono dinámico
                                                className="icon-selector"
                                            />

                                        </div>
                                    </Form.Group>

                                </div>

                                <div className="floating-label col-12 col-lg-7" >
                                    <Form.Group controlId="numberIdentification" className="numberIdentification">

                                        <Form.Control
                                            type="number"
                                            name="numberIdentification"
                                            value={formData.numberIdentification}
                                            onChange={handleInputChange}
                                            placeholder=""
                                            required
                                            maxLength={20}
                                            onInput={(e) => {
                                                // Limita el input a 10 dígitos
                                                e.target.value = e.target.value.slice(0, 20);
                                                e.target.setCustomValidity('');
                                                if (e.target.value.length < 4) {
                                                    e.target.setCustomValidity('Por favor, ingresa un numero de identificación valido.');
                                                }
                                            }}
                                        />
                                        <Form.Label>Número de identificación</Form.Label>
                                    </Form.Group>
                                </div>


                                <div className="floating-label col-12 ">
                                    <Form.Group controlId="email" className="email"  >

                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder=""
                                            required
                                            maxLength={70}
                                        />
                                        <Form.Label>Correo electrónicos</Form.Label>
                                    </Form.Group>
                                </div>

                                <div className='col-12 floating-label'>
                                    <Form.Group controlId="phoneNumber" className="phoneNumber">

                                        <Form.Control
                                            type="number"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            placeholder=""
                                            required
                                            pattern="^[0-9]{10}$"
                                            inputMode="numeric"
                                            onInput={(e) => {
                                                // Limita el input a 10 dígitos
                                                e.target.value = e.target.value.slice(0, 10);
                                                e.target.setCustomValidity('');
                                                if (e.target.value.length < 10) {
                                                    e.target.setCustomValidity('Por favor, ingresa un número de teléfono de 10 dígitos.');
                                                }
                                            }}
                                            maxLength={10}
                                            onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un número de teléfono válido.')}
                                        />
                                        <Form.Label>Número de teléfono</Form.Label>
                                    </Form.Group>

                                </div>

                                <div className=" col-12 floating-label">
                                    <Form.Group controlId="address" className="address">
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder=" "
                                            required
                                            maxLength={50}
                                        />
                                        <Form.Label>Dirección</Form.Label>
                                    </Form.Group>
                                </div>

                            </div>

                            <div className=" col-12 button-group" style={{backgroundColor:'red'}}>

                                <button type="submit" className='button-confirmationn' disabled={isEditingButtons} onClick={handleRegister}>
                                    Registrar Usuarios
                                </button>
                                
                                <button className='button-cancell' disabled={isEditingButtons} onClick={handleCancel}>
                                    Cancelar Registro
                                </button>

                            </div>
                        </Form>

                    </div>


                </div>

            </div>

            <ConfirmationModal
                show={showModal}
                onHide={handleCloseModal}
                onConfirm={handleConfirmAction}
                title={modalType === 'cancel' ? "Cancelar registro" : "Confirmar registro"}
                bodyText={modalType === 'cancel'
                    ? "¿Estás seguro de que deseas cancelar el registro? Se perderán todos los datos."
                    : "¿Estás seguro de que deseas registrar este usuario?"}
                confirmText={modalType === 'cancel' ? "Sí" : "Sí"}
                cancelText="No"
                containerId="modal-container"
            />

            {loading && (
                <div className="loading-overlay">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </div>
            )}

        </div>

    );
}
export default RegisterUserForm;
