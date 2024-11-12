import React from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import ImageDropzone from '../../loadImage/ImageDropzone';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';

import './UpdateClient.css';


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
    handleShowListEquipment,
    showModal,
    handleCloseModal,
    handleConfirmAction,
    isEditing,
    handleEditClick,
    modalType,
    handleShowListEquipmentClient,
    columns,
    records,
}) {
    return (
        <div className="form-container-update-client">
            <div className="title-component">
                <h2>Información cliente</h2>
            </div>
            <Form onSubmit={handleSubmit}>
                <Row className="flex-row-reverse flex-sm-row">

                    <Col xs={12} sm={6} className="order-1 order-sm-2">
                        {/* Nombre */}
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
                                    onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un nombre valido.')}
                                    onInput={(e) => e.target.setCustomValidity('')}
                                    disabled={!isEditing}
                                    className={!isEditing ? 'input-disabled' : ''}
                                />
                                <Form.Label>Nombre cliente:</Form.Label>
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
                                        <option value="NIT">NIT</option>
                                        <option value="CC">Cédula de ciudadania</option>
                                        <option value="CE">Cédula de extranjería</option>
                                        <option value="PA">Pasaporte</option>
                                    </Form.Control>
                                    <FontAwesomeIcon icon={faChevronDown} className="iconPro" />
                                </div>
                            </Form.Group>
                        </div>

                        <div className="floating-label-client">
                            <Form.Group controlId="numberIdentification" className="numberIdentification">
                                <Form.Control
                                    type="text"
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
                                    disabled={!isEditing}
                                    className={!isEditing ? 'input-disabled' : ''}

                                />
                                <Form.Label>Número de teléfono</Form.Label>
                            </Form.Group>
                        </div>

                        <div className="floating-label-client">
                            <Form.Group controlId="addressPro" className="addressPro">
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
                    </Col>
                    <Col xs={12} sm={6} className="order-2 order-sm-1">
                        {/* Usamos el componente ImageDropzone aquí */}
                        <div className="image-client order-3 order-sm-1">
                            <ImageDropzone
                                getRootProps={getRootProps}
                                getInputProps={getInputProps}
                                isDragActive={isDragActive}
                                image={image}
                                defaultImage={formData.pathImage || ''}
                                disabled={!isEditing}

                            />
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
                {isEditing ? (<div className='row table-container-update-client'>
                    <div className='col-12 col-md-5 title-equip' ><h2>Equipos</h2></div>
                    <div className='col-12 col-md-7 button-group-list-equip'>
                        <Button variant="primary" type="submit" className='button-select' disabled={isEditingButtons} >
                            Seleccionar
                        </Button>
                        <Button variant="secondary" className='button-clean' onClick={handleCancel} disabled={isEditingButtons}>
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
            ) : (<> </>)}
                <Row>
                    {isEditing ? (
                        <>  
                            <div className='col-12 col-sm-1 col-md-5'></div>
                            <div className='col-12 col-sm-11 col-md-7 group-buttons-client'>
                                <Button variant="primary" type="submit" className='button-confirmation' disabled={isEditingButtons} >
                                    Guardar cambios
                                </Button>
                                <Button variant="secondary" className='button-cancel' onClick={handleCancel} disabled={isEditingButtons}>
                                    Cancelar edición
                                </Button>
                            </div>

                        </>
                    ) : (
                        <>
                            <div className="button-group">
                                <Button variant="primary" type="submit" className='button-confirmation' onClick={handleShowListEquipmentClient} >
                                    Consultar equipos
                                </Button>
                                <Button variant="primary" type="button" className='button-confirmation' onClick={handleEditClick}>
                                    Editar
                                </Button>
                                <Button variant="secondary" type="button" className='button-cancel' onClick={handleShowListEquipment}>
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
                title={modalType === 'cancel' ? "Cancelar actialización" : "Confirmar Actulización"}
                bodyText={modalType === 'cancel'
                    ? "¿Deseas cancelar la actualización de la información del equipo? Las modificaciones realizadas no se guardarán."
                    : "¿Estás seguro de que deseas actualizar la información?"}
                confirmText='Si'//{modalType === 'cancel' ? "Sí, cancelar" : "Sí, actualizar"}
                cancelText='No'//{modalType === 'cancel' ? "No, no cancelar" : "No, no actualizar"}
                containerId="modal-container"
            />

            {/* Overlay de Carga */}
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
