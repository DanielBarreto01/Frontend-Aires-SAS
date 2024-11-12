import React from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import ImageDropzone from '../../loadImage/ImageDropzone';
import './UpdateEquipment.css';


function UpdateEquipmentForm({
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
}) {
    return (
        <div className='container-form-update-equipment'>
            <div className="title-component">
                <h2>Información equipo</h2>
            </div>
            <Form onSubmit={handleSubmit}>
                <Row className="flex-row-reverse flex-sm-row">

                    <Col xs={12} sm={6} className="order-1 order-sm-2">
                        {/* Nombre */}
                        <div className="floating-label-equipment">
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
                                <Form.Label>Nombre equipo:</Form.Label>
                            </Form.Group>
                        </div>

                        <div className="floating-label-equipment">
                            <Form.Group controlId="equipmentType" className="equipmentType">
                                <div className="icon-dropdown-equipment">
                                    <Form.Control
                                        as="select"
                                        name="equipmentType"
                                        value={formData.equipmentType}
                                        onChange={handleInputChange}
                                        required
                                        disabled={!isEditing}
                                        className={!isEditing ? 'input-disabled' : ''}
                                        style={{ border: 'none' }}
                                    >
                                        <option value="" disabled>Tipo de equipo</option>
                                        <option value="CONDENSADOR">Condensador</option>
                                        <option value="SECADOR">Secador</option>

                                    </Form.Control>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                            </Form.Group>
                        </div>

                        <div className="floating-label-equipment">
                            <Form.Group controlId="serialNumber" className="serialNumber">
                                <Form.Control
                                    type="text"
                                    name="serialNumber"
                                    value={formData.serialNumber}
                                    onChange={handleInputChange}
                                    required
                                    placeholder=""
                                    pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9]+$"
                                    maxLength={30}
                                    minLength={3}
                                    onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un número de serial valido valido.')}
                                    onInput={(e) => e.target.setCustomValidity('')}
                                    disabled={!isEditing}
                                    className={!isEditing ? 'input-disabled' : ''}
                                />
                                <Form.Label>Número de serie</Form.Label>
                            </Form.Group>
                        </div>

                        <div className="floating-label-equipment">
                            <Form.Group controlId="brand" className="brand">
                                <Form.Control
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    required
                                    placeholder=""
                                    maxLength={70}
                                    disabled={!isEditing}
                                    className={!isEditing ? 'input-disabled' : ''}
                                />
                                <Form.Label>Marca</Form.Label>
                            </Form.Group>
                        </div>

                        <div className="floating-label-equipment">
                            <Form.Group controlId="iventoryNumber" className="iventoryNumber">
                                <Form.Control
                                    type="number"
                                    name="iventoryNumber"
                                    value={formData.iventoryNumber}
                                    onChange={handleInputChange}
                                    required
                                    placeholder=""
                                    maxLength={20}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.slice(0, 20);
                                        e.target.setCustomValidity('');
                                        if (e.target.value.length < 1) {
                                            e.target.setCustomValidity('Por favor, ingresa un número de iventario valido.');
                                        }
                                    }}
                                    disabled={!isEditing}
                                    className={!isEditing ? 'input-disabled' : ''}
                                />
                                <Form.Label>Número en iventario</Form.Label>
                            </Form.Group>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} className="order-2 order-sm-1">
                        {/* Usamos el componente ImageDropzone aquí */}
                        <div className="image-equipment order-3 order-sm-1">
                            <ImageDropzone
                                getRootProps={getRootProps}
                                getInputProps={getInputProps}
                                isDragActive={isDragActive}
                                image={image}
                                defaultImage={formData.pathImage || ''}
                                disabled={!isEditing}

                            />
                        </div>

                        {/* Dirección */}
                        {/* <div className="floating-label-equipment"> */}
                        <div className="floating-label-equipment">
                            <Form.Group controlId="modelNumber" className="modelNumber">
                                <Form.Control
                                    type="text"
                                    name="modelNumber"
                                    value={formData.modelNumber}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    required
                                    maxLength={50}
                                    disabled={!isEditing}
                                    className={!isEditing ? 'input-disabled' : ''}
                                />
                                <Form.Label>Modelo</Form.Label>
                            </Form.Group>
                        </div>
                        {/* </div> */}
                        {/* Roles */}

                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={5}> </Col>

                    <Col xs={12} sm={7} className="d-flex justify-content-center">

                        {isEditing ? (
                            <>
                                <div className="button-group-equipment-update">
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
                                <div className="button-group-equipment-update">
                                    <Button variant="primary" type="button" className='button-confirmation' onClick={handleEditClick}>
                                        Editar
                                    </Button>
                                    <Button variant="secondary" type="button" className='button-cancel' onClick={handleShowListEquipment}>
                                        Regresar
                                    </Button>
                                </div>

                            </>
                        )}
                    </Col>
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

export default UpdateEquipmentForm;
