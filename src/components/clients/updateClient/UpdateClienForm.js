import React, { useRef, useState } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import ImageDropzone from '../../loadImage/ImageDropzone';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UpdateClient.css';
import "../../general.css";

function UpdateClientForm({
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    getRootProps,
    getInputProps,
    isDragActive,
    isEditingButtons,
    image,
    loading,
    handleCancel,
    handleShowListClients,
    showModal,
    handleCloseModal,
    handleConfirmAction,
    isEditing,
    handleEditClick,
    modalType,
    handleShowListlistAssignedEquipment,
    columns,
    records,
    handleSelectEquipmentaAviable,
    handleCleanSelectedEquipments,
    clientType,
    location // Añadir clientType como prop
}) {
    const dropzoneClass = clientType === 'JuridicalPersons' ? 'image-client-update-juridica' : 'image-client-update-natural';

    const formRef = useRef(null);

    const handleExternalSubmit = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    };

    const [dropdownState, setDropdownState] = useState({
        clinetStatus: false
    });

    const handleDropdownToggle = (controlId) => {
        setDropdownState((prevState) => ({
            ...prevState,
            [controlId]: !prevState[controlId] // Alterna el estado del dropdown correspondiente
        }));
    };

    return (
        <div row>

            <div className='col-12 col-lg-6 title1 ' style={{ marginBottom: '15px' }}>
                <h2 className="text-start title">Información cliente</h2>
            </div>

            <div className='col-12'>
                <div className='row'>

                    {/* derecha */}
                    <div className='col-12 col-lg-6' >
                        {/* <div className={`image-client-update ${dropzoneClass}` }> */}
                        <div className={clientType === 'JuridicalPersons' ? 'image-coponent-info-cliN' : 'image-coponent-info-cliJ'}>
                            <ImageDropzone
                                getRootProps={getRootProps}
                                getInputProps={getInputProps}
                                isDragActive={isDragActive}
                                image={image}
                                defaultImage={formData.pathImage || ''}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className='floating-label' >
                            <Form.Group controlId="address" className="address">
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



                        {clientType === 'JuridicalPersons' && (
                            <>
                                <div className="floating-label">
                                    <Form.Group controlId="emailLegalRepresentative" className="email" >
                                        <Form.Control
                                            type="email"
                                            name="emailLegalRepresentative"
                                            value={formData.emailLegalRepresentative}
                                            onChange={handleInputChange}
                                            placeholder=""
                                            required
                                            maxLength={70}
                                            disabled={!isEditing}
                                            className={!isEditing ? 'input-disabled' : ''}
                                        />
                                        <Form.Label>Correo representante legal:</Form.Label>
                                    </Form.Group>
                                </div>
                            </>
                        )}

                        <div className='floating-label' >
                            <Form.Group controlId="clientState" className="roles">
                                <div className="icon-container">
                                    <Form.Control
                                        as="select"
                                        name="clientState"
                                        value={formData.clientState === true ? 'AC' : 'IN'}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                clientState: e.target.value === 'AC',
                                            });
                                        }}
                                        required
                                        disabled={!isEditing}
                                        onClick={() => handleDropdownToggle("clinetStatus")}
                                        style={{ border: 'none' }}
                                        className={!isEditing ? 'input-disabled' : ''}
                                    >
                                        <option value="" disabled>Estado</option>
                                        <option value="AC">Activo</option>
                                        <option value="IN">Inactivo</option>

                                    </Form.Control>
                                    <FontAwesomeIcon
                                        icon={!dropdownState.clinetStatus ? faChevronDown : faChevronUp} // Ícono dinámico
                                        className="icon-selector"
                                    />
                                </div>
                            </Form.Group>
                        </div>




                    </div>




                    {/* izquierda */}
                    <div className="col-12 col-lg-6 form ">
                        <Form ref={formRef} onSubmit={handleSubmit}>
                            <div className='row'>
                                {clientType === 'NaturalPerson' && (
                                    <>
                                        <div className="floating-label col-12 col-lg-6">
                                            <Form.Group controlId="name" className="nameUser">
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder=""
                                                    pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                                                    maxLength={30}
                                                    onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un nombre válido.')}
                                                    onInput={(e) => e.target.setCustomValidity('')}
                                                    disabled={!isEditing}
                                                    className={!isEditing ? 'input-disabled' : ''}
                                                />
                                                <Form.Label>Nombre:</Form.Label>
                                            </Form.Group>
                                        </div>

                                        <div className="floating-label col-12 col-lg-6">
                                            <Form.Group controlId="lastName" className="lastNameUser">
                                                <Form.Control
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder=""
                                                    pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                                                    maxLength={30}
                                                    onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un apellido válido.')}
                                                    onInput={(e) => e.target.setCustomValidity('')}
                                                    disabled={!isEditing}
                                                    className={!isEditing ? 'input-disabled' : ''}
                                                />
                                                <Form.Label>Apellido:</Form.Label>
                                            </Form.Group>

                                        </div>

                                        <div clasname='col-12 '>
                                            <Form.Group controlId="typeIdentification" className="typeIdentificationUser floating-label">
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
                                                    >
                                                        <option value="" disabled>Tipo de identificación</option>
                                                        <option value="CC">CC</option>
                                                        <option value="CE">CE</option>
                                                        <option value="PA">PA</option>
                                                    </Form.Control>
                                                    <FontAwesomeIcon icon={faChevronDown} className="icon-selector" />
                                                </div>
                                            </Form.Group>

                                        </div>

                                        <div className="floating-label col-12">
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
                                                        // Limita el input a 20 dígitos
                                                        e.target.value = e.target.value.slice(0, 20);
                                                        e.target.setCustomValidity('');
                                                        if (e.target.value.length < 4) {
                                                            e.target.setCustomValidity('Por favor, ingresa un número de identificación válido.');
                                                        }
                                                    }}
                                                    disabled={!isEditing}
                                                    className={!isEditing ? 'input-disabled' : ''}
                                                />
                                                <Form.Label>Número de identificación</Form.Label>
                                            </Form.Group>

                                        </div>




                                    </>
                                )}


                                {clientType === 'JuridicalPersons' && (
                                    <>
                                        <div className="floating-label col-12" style={{ bagraunk: 'blue' }}>
                                            <Form.Group controlId="nameCompany" className="nameUser">
                                                <Form.Control
                                                    type="text"
                                                    name="nameCompany"
                                                    value={formData.nameCompany}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder=""
                                                    pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                                                    maxLength={30}
                                                    onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un nombre válido.')}
                                                    onInput={(e) => e.target.setCustomValidity('')}
                                                    disabled={!isEditing}
                                                    className={!isEditing ? 'input-disabled' : ''}
                                                />
                                                <Form.Label>Nombre Empresa:</Form.Label>
                                            </Form.Group>

                                        </div>

                                        <div className="floating-label col-12">
                                            <Form.Group controlId="numberIdentificationCompany" className="numberIdentification">
                                                <Form.Control
                                                    type="number"
                                                    name="numberIdentificationCompany"
                                                    value={formData.numberIdentificationCompany}
                                                    onChange={handleInputChange}
                                                    placeholder=""
                                                    required
                                                    maxLength={20}
                                                    onInput={(e) => {
                                                        // Limita el input a 20 dígitos
                                                        e.target.value = e.target.value.slice(0, 20);
                                                        e.target.setCustomValidity('');
                                                        if (e.target.value.length < 4) {
                                                            e.target.setCustomValidity('Por favor, ingresa un número de identificación válido.');
                                                        }
                                                    }}
                                                    disabled={!isEditing}
                                                    className={!isEditing ? 'input-disabled' : ''}
                                                />
                                                <Form.Label>NIT</Form.Label>
                                            </Form.Group>

                                        </div>

                                        <div className="floating-label col-12">
                                            <Form.Group controlId="socialReason" className="email">
                                                <Form.Control
                                                    type="text"
                                                    name="socialReason"
                                                    value={formData.socialReason}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder=""
                                                    pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                                                    maxLength={30}
                                                    onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un nombre válido.')}
                                                    onInput={(e) => e.target.setCustomValidity('')}
                                                    disabled={!isEditing}
                                                    className={!isEditing ? 'input-disabled' : ''}
                                                />
                                                <Form.Label>Razón Social:</Form.Label>
                                            </Form.Group>

                                        </div>
                                        <div className="floating-label col-12">
                                            <Form.Group controlId="nameLegalRepresentative" className="nameUser">
                                                <Form.Control
                                                    type="text"
                                                    name="nameLegalRepresentative"
                                                    value={formData.nameLegalRepresentative}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder=""
                                                    pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                                                    maxLength={30}
                                                    onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un nombre válido.')}
                                                    onInput={(e) => e.target.setCustomValidity('')}
                                                    disabled={!isEditing}
                                                    className={!isEditing ? 'input-disabled' : ''}
                                                />
                                                <Form.Label>Nombre representante Legal:</Form.Label>
                                            </Form.Group>
                                        </div>


                                        <div className="floating-label col-12">
                                            <Form.Group controlId="phoneNumberLegalRepresentative" className="phoneNumber">
                                                <Form.Control
                                                    type="number"
                                                    name="phoneNumberLegalRepresentative"
                                                    value={formData.phoneNumberLegalRepresentative}
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
                                                    disabled={!isEditing}
                                                    className={!isEditing ? 'input-disabled' : ''}
                                                />
                                                <Form.Label>Teléfono representante legal:</Form.Label>
                                            </Form.Group>
                                        </div>
                                    </>
                                )}

                                <div className="floating-label col-12">
                                    <Form.Group controlId="email" className="email" >
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

                                <div className="floating-label col-12">
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
                                            disabled={!isEditing}
                                            className={!isEditing ? 'input-disabled' : ''}
                                        />
                                        <Form.Label>Número de teléfono</Form.Label>
                                    </Form.Group>
                                </div>
                            </div>
                        </Form>
                    </div>

                    <div className='col-12'>
                        {isEditing ? (
                            <div className='row table-container-update-client'>
                                <div className='col-12 col-md-5 title-equip'><h2>Equipos</h2></div>

                                <div className='col-12 col-md-7 button-group-list-equip'>
                                    <button type="submit" className='button-clean' onClick={handleSelectEquipmentaAviable} disabled={isEditingButtons}>
                                        Seleccionar
                                    </button>
                                    <button className='button-clean' onClick={handleCleanSelectedEquipments} disabled={isEditingButtons}>
                                        Limpiar
                                    </button>


                                </div>
                                <div className="table-container-client-list-quip">
                                    <DataTable
                                        columns={columns}
                                        data={records}
                                        pagination
                                        paginationPerPage={1}
                                        fixedHeader
                                        persistTableHead
                                        fixedHeaderScrollHeight="30vh"
                                        noDataComponent="No hay datos disponibles"
                                        progressComponent={(
                                            <div className="loading-overlay">
                                                <Spinner animation="border" size="lg" />
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        ) : (<></>)}
                    </div>


                    <div className="col-lg-6"></div>
                    <div className=" col-lg-6">
                        {isEditing ? (
                            <>
                                <div className="button-group">
                                    <button type="submit" className='button-confirmationn' onClick={handleExternalSubmit}>
                                        Guardar cambios
                                    </button>

                                    <button className='button-cancell' onClick={handleCancel}>
                                        Cancelar edición
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="button-group">
                                    {location.pathname.includes('showClient') ? (
                                        // Solo mostrar el botón "Regresar" si isBackButtonVisible es true
                                        <button className='button-cancell' onClick={handleShowListClients} disabled={isEditingButtons}>
                                            Regresar
                                        </button>
                                    ) : (
                                        <>
                                            {/* Mostrar los otros botones si isBackButtonVisible es false */}
                                            <button type="button" className='button-confirmationn' onClick={handleShowListlistAssignedEquipment} disabled={isEditingButtons}>
                                                Consultar equipos
                                            </button>
                                            <button className='button-confirmationn' onClick={handleEditClick} disabled={isEditingButtons}>
                                                Editar
                                            </button>
                                            <button className='button-cancell' onClick={handleShowListClients} disabled={isEditingButtons}>
                                                Regresar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div >

            <ConfirmationModal
                show={showModal}
                onHide={handleCloseModal}
                onConfirm={handleConfirmAction}
                title={modalType === 'cancel' ? "Cancelar actualización" : "Confirmar Actualización"}
                bodyText={modalType === 'cancel'
                    ? "¿Deseas cancelar la actualización de la información del cliente? Las modificaciones realizadas no se guardarán."
                    : "¿Estás seguro de que deseas actualizar la información?"}
                confirmText='Sí'
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

        </div >
    );
}

export default UpdateClientForm;