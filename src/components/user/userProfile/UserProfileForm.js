import React, { useState } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import ImageDropzone from '../../loadImage/ImageDropzone';

import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
// import '../registerUser/RegisterUser.css';



function UserProfileForm({ formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    getRootProps,
    getInputProps,
    isDragActive,
    image,
    loading,
    handleCancel,
    handleShowListUsers,
    showModal,
    handleCloseModal,
    handleConfirmAction,
    isEditing,
    isEditingButtons,
    handleEditClick,
    modalType }) {

    const [dropdownState, setDropdownState] = useState({
        rolesPro: false, // Estado del dropdown de roles
        userStatusPro: false,
        typeIdentificationPro: false,
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
                <h2 className="text-start title">Información Usuario</h2>
            </div>

            <div className='col-12'>
                <div className='row'>
                    <div className='col-12 col-lg-6' >
                        <div className="image-coponent-info">
                            <ImageDropzone
                                getRootProps={getRootProps}
                                getInputProps={getInputProps}
                                isDragActive={isDragActive}
                                image={image}
                                defaultImage={formData.pathImage || ''}
                                disabled={!isEditing}

                            />

                        </div>

                        <div className='floating-label'>
                            <Form.Group controlId="rolesPro" className="roles">
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
                                        disabled={!isEditing}
                                        className={!isEditing ? 'input-disabled' : ''}
                                        onClick={() => handleDropdownToggle("rolesPro")} // Cambia solo el estado de rolesPro
                                        style={{ border: 'none' }}
                                    >
                                        <option value="" disabled>Selecione un rol</option>
                                        <option value="ADMIN">Administrador</option>
                                        <option value="INTERNAL_TECHNICIAN">Tecnico interno</option>
                                        <option value="EXTERNAL_TECHNICIAN">Tecnico externo</option>
                                    </Form.Control>
                                    <FontAwesomeIcon
                                        icon={dropdownState.rolesPro ? faChevronUp : faChevronDown} // Ícono dinámico
                                        className="icon-selector"
                                    />
                                </div>
                            </Form.Group>
                        </div>

                        <div className='floating-label'>
                            <Form.Group controlId="userStatusPro" className="roles">
                                <div className="icon-container">
                                    <Form.Control
                                        as="select"
                                        name="userStatus"
                                        value={formData.userStatus === true ? 'AC' : 'IN'}
                                        onChange={(e) => {
                                            const { value } = e.target;
                                            setFormData({
                                                ...formData,
                                                userStatus: value === 'AC',
                                            });
                                        }}
                                        required
                                        disabled={!isEditing}
                                        style={{ border: 'none' }}
                                        onClick={() => handleDropdownToggle("userStatusPro")}
                                        className={!isEditing ? 'input-disabled' : ''}
                                    >
                                        <option value="" disabled>Estado</option>
                                        <option value="AC">Activo</option>
                                        <option value="IN">Inactivo</option>

                                    </Form.Control>
                                    <FontAwesomeIcon
                                        icon={dropdownState.userStatusPro ? faChevronUp : faChevronDown} // Ícono dinámico
                                        className="icon-selector"
                                    />
                                </div>
                            </Form.Group>

                        </div>
                    </div>



                    <div className="col-12 col-lg-6 form ">
                        <Form onSubmit={handleSubmit}>
                            <div className='row'>
                                <div className="floating-label col-12 col-lg-6"  >
                                    <Form.Group controlId="nameUserPro" className='nameUser'>
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
                                            disabled={!isEditing}
                                            className={!isEditing ? 'input-disabled' : ''}
                                        />
                                        <Form.Label>Nombres</Form.Label>
                                    </Form.Group>
                                </div>

                                <div className="floating-label col-12 col-lg-6">
                                    <Form.Group controlId="lastNamePro" className='lastNameUser' >
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
                                            disabled={!isEditing}
                                            className={!isEditing ? 'input-disabled' : ''}
                                        />
                                        <Form.Label>Apellidos</Form.Label>
                                    </Form.Group>

                                </div>

                                <div clasname='col-12 '>
                                    <Form.Group controlId="typeIdentificationPro" className="typeIdentificationUser floating-label">
                                        <div className="icon-container">
                                            <Form.Control
                                                as="select"
                                                name="typeIdentification"
                                                value={formData.typeIdentification}
                                                onChange={handleInputChange}
                                                required
                                                disabled={!isEditing}
                                                className={!isEditing ? 'input-disabled' : ''}
                                                style={{ border: 'none' }}

                                                onClick={() => handleDropdownToggle("typeIdentificationPro")}
                                            >
                                                <option value="" disabled>Tipo de identificación</option>
                                                <option value="CC">Cédula de ciudadanía</option>
                                                <option value="CE">Cédula de extranjería</option>
                                                <option value="PA">Pasaporte</option>
                                            </Form.Control>

                                            <FontAwesomeIcon
                                                icon={dropdownState.typeIdentificationPro ? faChevronUp : faChevronDown}
                                                className="icon-selector"
                                            />
                                        </div>
                                    </Form.Group>

                                </div>



                                <div className="floating-label col-12">
                                    <Form.Group controlId="numberIdentificationPro" className="numberIdentification">
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
                                            disabled={!isEditing}
                                            className={!isEditing ? 'input-disabled' : ''}
                                        />
                                        <Form.Label>Número de identificación</Form.Label>
                                    </Form.Group>
                                </div>

                                <div className="floating-label col-12 ">
                                    <Form.Group controlId="emailPro" className="email" style={{ outline: '0px' }} >
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder=""
                                            required
                                            maxLength={70}
                                            disabled={!isEditing}
                                            className={!isEditing ? 'input-disabled' : ''}
                                        />
                                        <Form.Label>Correo electrónico</Form.Label>
                                    </Form.Group>
                                </div>
                                <div className='col-12 floating-label'>
                                    <Form.Group controlId="phoneNumberPro" className="phoneNumber">
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
                                            disabled={!isEditing}
                                            className={!isEditing ? 'input-disabled' : ''}
                                        />
                                        <Form.Label>Número de teléfono</Form.Label>
                                    </Form.Group>

                                </div>


                                <div className=" col-12 floating-label">
                                    <Form.Group controlId="addressPro" className="address">
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder=" "
                                            required
                                            maxLength={50}
                                            disabled={!isEditing}
                                            className={!isEditing ? 'input-disabled' : ''}
                                        />
                                        <Form.Label>Dirección</Form.Label>
                                    </Form.Group>

                                </div>

                                <div className=" col-12">
                                    {isEditing ? (
                                        <>
                                            <div className="button-group">
                                                <button type="submit" className='button-confirmationn' disabled={loading}>
                                                    Guardar cambios
                                                </button>

                                                <button className='button-cancell' onClick={handleCancel}>
                                                    Cancelar edición
                                                </button>
                                                
                                            </div>

                                        </>
                                    ) : (
                                        <>
                                            <div className="button-group col-12">
                                                <button type="button" className='button-confirmationn' disabled={isEditingButtons}  onClick={handleEditClick}>
                                                    Editar
                                                </button>
                                                <button type="button" className='button-cancell'  disabled={isEditingButtons} onClick={handleShowListUsers}>
                                                    Regresar
                                                </button>


                                            </div>

                                        </>
                                    )}
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>



            <ConfirmationModal
                show={showModal}
                onHide={handleCloseModal}
                onConfirm={handleConfirmAction}
                title={modalType === 'cancel' ? "Cancelar actialización" : "Confirmar Actulización"}
                bodyText={modalType === 'cancel'
                    ? "¿Deseas cancelar la actualización de la información del usuario? Las modificaciones realizadas no se guardarán."
                    : "¿Estás seguro de que deseas actualizar la información?"}
                confirmText='Si'
                cancelText='No'
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

export default UserProfileForm;
