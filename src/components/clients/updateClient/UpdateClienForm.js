import React from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
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
    clientType // Añadir clientType como prop
}) {
    const dropzoneClass = clientType === 'JuridicalPersons' ? 'image-client-update-juridica' : 'image-client-update-natural';

    return (
        <div className="form-container-update-client">
            <div className="title-component">
                <h2>Información cliente</h2>
            </div>
            <Form onSubmit={handleSubmit}>
                <Row className="flex-row-reverse flex-sm-row">
                    <Col xs={12} sm={6} className="order-1 order-sm-2">
                        {clientType === 'NaturalPerson' && (
                            <>
                                {/* Campos específicos para Persona Natural */}
                                <div className="floating-label-client">
                                    <Form.Group controlId="name" className="name">
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
                                <div className="floating-label-client">
                                    <Form.Group controlId="lastName" className="lastName">
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
                                <div className="floating-label-client">
                                    <Form.Group controlId="typeIdentification" className="typeIdentification">
                                        <div className="icon-dropdown-client">
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
                                            <FontAwesomeIcon icon={faChevronDown} className="iconPro" />
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="floating-label-client">
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
                                {/* Campos específicos para Persona Jurídica */}
                                <div className="floating-label-client">
                                    <Form.Group controlId="nameCompany" className="nameCompany">
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
                                <div className="floating-label-client">
                                    <Form.Group controlId="numberIdentificationCompany" className="numberIdentificationCompany">
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
                                <div className="floating-label-client">
                                    <Form.Group controlId="socialReason" className="socialReason">
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
                                <div className="floating-label-client">
                                    <Form.Group controlId="nameLegalRepresentative" className="nameLegalRepresentative">
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
                                <div className="floating-label-client">
                                    <Form.Group controlId="phoneNumberLegalRepresentative" className="phoneNumberLegalRepresentative">
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
                                <div className="floating-label-client">
                                    <Form.Group controlId="emailLegalRepresentative" className="emailLegalRepresentative" style={{ outline: '0px' }} >
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

                        <div className="floating-label-client">
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
                        <div className="floating-label-client">
                            <Form.Group controlId="email" className="email" style={{ outline: '0px' }} >
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
                    </Col>
                    <Col xs={12} sm={6} className="order-2 order-sm-1">
                        {/* Usamos el componente ImageDropzone aquí */}
                        <div className={`image-client-update ${dropzoneClass} order-3 order-sm-1`}>
                            <ImageDropzone
                                getRootProps={getRootProps}
                                getInputProps={getInputProps}
                                isDragActive={isDragActive}
                                image={image}
                                defaultImage={formData.pathImage || ''}
                                disabled={!isEditing}
                            />
                        </div>
                        {/* Campos comunes */}

                        <div className="floating-label-client">
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

                        <div className="floating-label-client">
                            <Form.Group controlId="clientState" className="clientState order-3 order-sm-2">
                                <div className="icon-dropdown-client">
                                    <Form.Control
                                        as="select"
                                        name="clientState"
                                        value={formData.clientState === true ? 'AC' : 'IN'}
                                        onChange={(e) => {
                                            const { value } = e.target;
                                            setFormData({
                                                ...formData,
                                                clientState: value === 'AC',  // Si es 'AC', asigna true; si es 'IN', asigna false
                                            });
                                        }}
                                        required
                                        disabled={!isEditing}
                                        style={{ border: 'none' }}
                                        className={!isEditing ? 'input-disabled' : ''}
                                    >
                                        <option value="" disabled>Estado</option>
                                        <option value="AC">Activo</option>
                                        <option value="IN">Inactivo</option>
                                    </Form.Control>
                                    <FontAwesomeIcon icon={faChevronDown} className="iconPro" />
                                </div>
                            </Form.Group>
                        </div>
                    </Col>
                </Row>
                {isEditing ? (
                    <div className='row table-container-update-client'>
                        <div className='col-12 col-md-5 title-equip'><h2>Equipos</h2></div>
                        <div className='col-12 col-md-7 button-group-list-equip'>
                            <Button variant="primary" type="submit" className='button-select' onClick={handleSelectEquipmentaAviable} disabled={isEditingButtons}>
                                Seleccionar
                            </Button>
                            <Button variant="secondary" className='button-clean' onClick={handleCleanSelectedEquipments} disabled={isEditingButtons}>
                                Limpiar
                            </Button>
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
                <Row>
                    {isEditing ? (
                        <>
                            <div className='col-12 col-sm-1 col-md-5'></div>
                            <div className='col-12 col-sm-11 col-md-7 group-buttons-client'>
                                <Button variant="primary" type="submit" className='button-confirmationn' >
                                    Guardar cambios
                                </Button>
                                <Button variant="secondary" className='button-cancell' onClick={handleCancel} >

                                    Cancelar edición
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="button-group">
                                <Button variant="secondary" type="button" className='button-confirmationn' onClick={handleShowListlistAssignedEquipment} disabled={isEditingButtons}>
                                    Consultar equipos
                                </Button>
                                <Button variant="primary" type="button" className='button-confirmationn' onClick={handleEditClick}disabled={isEditingButtons}>
                                    Editar
                                </Button>
                                <Button variant="secondary" type="button" className='button-cancell' onClick={ handleShowListClients}  disabled={isEditingButtons}>
                                    Regresar
                                </Button>
                            </div>
                        </>
                    )}
                </Row>
            </Form>
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
        </div>
    );
}

export default UpdateClientForm;