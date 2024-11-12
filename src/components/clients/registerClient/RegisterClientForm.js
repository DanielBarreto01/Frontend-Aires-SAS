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
    handleShowListEquipmentClient,
    clientType,
    modalType }) {

    return (
        <div className='formu'>
            <div className='title-register'><h2>Registro de Cliente</h2></div>
            <Form onSubmit={handleSubmit}>
                <Row className="flex-row-reverse flex-sm-row">
                    <Col xs={12} sm={6} className="order-1 order-sm-2">
                        {clientType === 'natural' && (
                            <>
                                {/* Campos específicos para Persona Natural */}
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
                                            onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un nombre válido.')}
                                            onInput={(e) => e.target.setCustomValidity('')}
                                        />
                                        <Form.Label>Nombre:</Form.Label>
                                    </Form.Group>
                                </div>
                                <div className="floating-label-equipment">
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
                                        />
                                        <Form.Label>Apellidos:</Form.Label>
                                    </Form.Group>
                                </div>
                                <div className="floating-label-equipment">
                                    <Form.Group controlId="equipmentType" className="equipmentType">
                                        <div className="icon-dropdown-equipment">
                                            <Form.Control
                                                as="select"
                                                name="typeIdentification"
                                                value={formData.typeIdentification}
                                                onChange={handleInputChange}
                                                required
                                                style={{ border: 'none' }}
                                            >
                                                <option value="" disabled>Tipo de identificación</option> {/* Opción predeterminada */}
                                                <option value="CC">CC</option>
                                                <option value="CE">CE</option>
                                                <option value="PA">PA</option>
                                            </Form.Control>
                                            <FontAwesomeIcon icon={faChevronDown} className="icon" />
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="floating-label">
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
                                <div className="floating-label-equipment">
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
                                        />
                                        <Form.Label>Nombre Empresa:</Form.Label>
                                    </Form.Group>
                                </div>
                                <div className="floating-label">
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
                                        />
                                        <Form.Label>NIT</Form.Label>
                                    </Form.Group>
                                </div>
                                <div className="floating-label-equipment">
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
                                        />
                                        <Form.Label>Razón Social:</Form.Label>
                                    </Form.Group>
                                </div>
                                <div className="floating-label-equipment">
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
                                        />
                                        <Form.Label>Nombre representante Legal:</Form.Label>
                                    </Form.Group>
                                </div>
                                <div className="floating-label">
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
                                        />
                                        <Form.Label>Teléfono representante legal:</Form.Label>
                                    </Form.Group>
                                </div>
                                <div className="floating-label">
                                    <Form.Group controlId="emailLegalRepresentative" className="emailLegalRepresentative" style={{ outline: '0px' }} >
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
                         {/* Campos comunes */}
                         <div className="floating-label">
                            <Form.Group controlId="email" className="email" style={{ outline: '0px' }} >
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
                        <div className="floating-label">
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
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={6}> </Col>

                    <Col xs={12} sm={6} className="d-flex justify-content-center">
                        <div className="button-group">
                            <Button variant="primary" type="submit" className='button-confirmation' onClick={handleShowListEquipmentClient} >
                                Asociar equipos
                            </Button>
                            <Button variant="primary" type="submit" className='button-confirmation' disabled={isEditingButtons}>
                                Registrar cliente
                            </Button>
                            <Button variant="secondary" className='button-cancel' onClick={handleCancel} disabled={isEditingButtons}>
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
export default RegisterClientForm;
