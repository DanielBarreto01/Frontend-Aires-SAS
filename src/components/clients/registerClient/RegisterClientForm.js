import React from 'react';
import { Form, Button, Row, Col, Image, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import ImageDropzone from '../../loadImage/ImageDropzone';

function RegisterClientForm({ formData,
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
    isEditingButtons,
    showModal,
    handleCloseModal,
    handleConfirmAction,
    modalType }) {

    return (
        <div className='formu'>
            <div className='title-register'><h2>Registro de Cliente</h2></div>
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
                                    onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un número de serie valido valido.')}
                                    onInput={(e) => e.target.setCustomValidity('')}
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
                                />
                                <Form.Label>Modelo</Form.Label>
                            </Form.Group>
                        </div>
                        {/* </div> */}
                        {/* Roles */}

                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={6}> </Col>

                    <Col xs={12} sm={6} className="d-flex justify-content-center">
                        <div className="button-group">
                            <Button variant="primary" type="submit" className='button-confirmation' disabled = {isEditingButtons}>
                                Registrar equipo
                            </Button>
                            <Button variant="secondary" className='button-cancel' onClick={handleCancel} disabled = {isEditingButtons}>
                            Cancelar Registro
                            </Button>
                        </div>

                    </Col>
                </Row>
            </Form>
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
export default  RegisterClientForm;
