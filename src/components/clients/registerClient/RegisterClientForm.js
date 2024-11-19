import { Form, Button, Row, Col, Image, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import ImageDropzone from '../../loadImage/ImageDropzone';
import './RegisterClient.css';
import DataTable from 'react-data-table-component';
import "../../general.css";
import React, { useRef } from 'react';

function RegisterClientForm({ formData,
    setFormData,
    handleInputChange,
    handleSelectEquipmentaAviable,
    handleSubmit,
    getRootProps,
    getInputProps,
    isDragActive,
    image,
    loading,
    handleCancel,
    isEditingButtons,
    showModal,
    handleCloseModal,
    handleConfirmAction,
    handleShowListEquipmentClient,
    handleCleanSelectedEquipments,
    clientType,
    modalType,
    records,
    columns }) {

    const formRef = useRef(null);

    const handleExternalSubmit = () => {
        if (formRef.current) {
            formRef.current.requestSubmit(); 
        }
    };

    return (
        <div className='row' >

            <div className='col-12 col-lg-6 title1 ' style={{ marginBottom: '15px' }}>
                <h2 className="text-start title">Registro de Cliente</h2>
            </div>

            <div className='col-12'>

                <div className='row'>

                    <div className='col-12 col-lg-6' >
                        <div className={clientType === 'juridica' ? 'image-coponent' : 'image-coponent-info'}>
                            <ImageDropzone
                                getRootProps={getRootProps}
                                getInputProps={getInputProps}
                                isDragActive={isDragActive}
                                image={image}
                                defaultImage={formData.pathImage || ''}
                            />
                        </div>


                        <div className='floating-label' >
                            <div className="floating-label">
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


                        {clientType === 'juridica' && (
                            <>
                                <div className="floating-label">
                                    <Form.Group controlId="emailLegalRepresentative" className="email" style={{ outline: '0px' }} >
                                        <Form.Control
                                            type="email"
                                            name="emailLegalRepresentative"
                                            value={formData.emailLegalRepresentative}
                                            onChange={handleInputChange}
                                            placeholder=""
                                            required
                                            maxLength={70}
                                        />
                                        <Form.Label>Correo representante legal:</Form.Label>
                                    </Form.Group>
                                </div>

                            </>
                        )}





                    </div>










                    <div className="col-12 col-lg-6 form ">

                        {/* <Form onSubmit={handleSubmit} > */}
                        <Form ref={formRef} onSubmit={handleSubmit}>


                            <div className='row'>
                                {clientType === 'natural' && (
                                    <>
                                        {/* Campos específicos para Persona Natural */}
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
                                                />
                                                <Form.Label>Apellidos:</Form.Label>
                                            </Form.Group>

                                        </div>
                                        <div clasname='col-12 '>
                                            <Form.Group controlId="equipmentType" className="typeIdentificationUser floating-label">
                                                <div className="icon-container">
                                                    <Form.Control
                                                        as="select"
                                                        name="typeIdentification"
                                                        value={formData.typeIdentification}
                                                        onChange={handleInputChange}
                                                        required
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
                                                />
                                                <Form.Label>Número de identificación</Form.Label>
                                            </Form.Group>

                                        </div>

                                    </>
                                )}



                                {clientType === 'juridica' && (



                                    <>
                                        {/* Campos específicos para Persona Jurídica */}

                                        <div className="floating-label col-12">
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
                                                />
                                                <Form.Label>Teléfono representante legal:</Form.Label>
                                            </Form.Group>
                                        </div>


                                    </>
                                )}
                                <div className="floating-label col-12">
                                    <Form.Group controlId="email" className="email">
                                        {/* <Form.Label>Email</Form.Label> */}
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder=""
                                            required
                                            maxLength={70}
                                        />
                                        <Form.Label>Correo electrónico</Form.Label>
                                    </Form.Group>
                                </div>

                                <div className="floating-label col-12">
                                    <Form.Group controlId="phoneNumber" className="phoneNumber">
                                        {/* <Form.Label>Phone Number</Form.Label> */}
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

                            </div>
                        </Form>
                    </div>

                    <div className='col-12'>
                        <div className='row table-container-update-client'>

                            <div className='col-12 col-md-5 title-equip' ><h2>Equipos</h2></div>
                            <div className='col-12 col-md-7 button-group-list-equip'>
                                <button type="submit" className='button-clean' onClick={handleSelectEquipmentaAviable}>
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
                                    paginationPerPage={2}
                                    fixedHeader
                                    persistTableHead
                                    fixedHeaderScrollHeight="30vh"
                                    // conditionalRowStyles={conditionalRowStyles}
                                    // paginationComponentOptions={customPaginationOptions}
                                    noDataComponent="No hay datos disponibles"
                                    progressComponent={(
                                        <div className="loading-overlay">
                                            <Spinner animation="border" size="lg" />
                                        </div>
                                    )}
                                />
                            </div>

                        </div>
                    </div>
                    <div className="col-lg-6" ></div>




                    <div className='col-lg-6 button-group '>

                        <button type="button" className='button-confirmationn' disabled={isEditingButtons} onClick={handleExternalSubmit} >
                     
                            
                            Registrar clientes
                        </button>

                        <button className='button-cancell' onClick={handleCancel} disabled={isEditingButtons}>
                            Cancelar Registro
                        </button>
                    </div>

                </div>

            </div >

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

        </div >


    );
}
export default RegisterClientForm;
