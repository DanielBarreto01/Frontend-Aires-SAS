import React from 'react';
import { Form, Button, Row, Col, Image, Spinner } from 'react-bootstrap';
import './RegisterUser.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import ImageDropzone from '../../loadImage/ImageDropzone';

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
    modalType }) {

    return (
        <div className='formu'>
            <div className='title-register'><h2>Registro de Usuario</h2></div>
            <Form onSubmit={handleSubmit}>
                <Row className="flex-row-reverse flex-sm-row">
                    <Col xs={12} sm={6} className='order-1 order-sm-2 display-grid'>
                        <Row>
                            <Col xs={12} sm={6}>
                                <div className="floating-label">
                                    <Form.Group controlId="name" className='nameUser'>
                                        {/* <Form.Label>Name</Form.Label> */}
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
                            </Col>

                            <Col xs={12} sm={6}>
                                <div className="floating-label">
                                    <Form.Group controlId="lastName" className='lastNameUser' >
                                        {/* <Form.Label>Last Name</Form.Label> */}
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
                            </Col>
                        </Row>
                        <Form.Group controlId="typeIdentificationUser" className="typeIdentificationUser">
                            {/* <Form.Label>Type of Identification</Form.Label> */}
                            <div className="icon-container">
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

                        <div className="floating-label">
                            <Form.Group controlId="numberIdentification" className="numberIdentification">
                                {/* <Form.Label>Number Identification</Form.Label> */}
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
                    <Col xs={12} sm={6} className='order-2 order-sm-1'>
                        {/* Usamos el componente ImageDropzone aquí */}
                        <div className="image-coponent order-3 order-sm-1">
                            <ImageDropzone
                                getRootProps={getRootProps}
                                getInputProps={getInputProps}
                                isDragActive={isDragActive}
                                image={image}
                                defaultImage={''}

                            />
                        </div>

                        {/* Dirección */}
                        <Form.Group controlId="roles" className="roles order-3 order-sm-2">
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
                                    style={{ border: 'none' }}
                                >
                                    <option value="" disabled>Selecione un rol</option>
                                    <option value="ADMIN">Administrador</option>
                                    <option value="INTERNAL_TECHNICIAN">Tecnico interno</option>
                                    <option value="EXTERNAL_TECHNICIAN">Tecnico externo</option>
                                </Form.Control>
                                <FontAwesomeIcon icon={faChevronDown} className="icon" />
                            </div>
                        </Form.Group>
                    </Col>

                </Row>
                <div className="button-group">
                    <Button variant="primary" type="submit" className='button-register' disabled={loading} onClick={handleRegister} >
                        Registrar Usuario
                    </Button>
                    <Button variant="secondary" className='button-no-register' disabled={loading} onClick={handleCancel} >
                        Cancelar Registro
                    </Button>
                </div>
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
export default RegisterUserForm;
