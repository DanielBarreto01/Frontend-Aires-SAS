import React from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import ImageDropzone from '../../loadImage/ImageDropzone';


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
    handleRegister, 
    showModal, 
    handleCloseModal, 
    handleConfirmAction, 
    modalType}) {

    return (
        <div className='formu'>
            <h2>Información Usuario</h2>
            <Form onSubmit={handleSubmit}>
                <Row className="flex-row-reverse flex-sm-row">
                    
                    <Col xs={12} sm={6} className="order-1 order-sm-2">
                        <Row>
                            <Col xs={12} sm={6}>
                                <div className="floating-label">
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
                            </Col>

                            <Col xs={12} sm={6}>
                                <div className="floating-label">
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
                            </Col>
                        </Row>

                        {/* Tipo de Identificación */}
                        <Form.Group controlId="typeIdentification" className="typeIdentification">
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
                                    <option value="CC">Cédula de ciudadanía</option>
                                    <option value="CE">Cédula de extranjería</option>
                                    <option value="PA">Pasaporte</option>
                                </Form.Control>
                                <FontAwesomeIcon icon={faChevronDown} className="icon" />
                            </div>
                        </Form.Group>

                        {/* Número de Identificación */}
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

                        {/* Email */}
                        <div className="floating-label">
                            <Form.Group controlId="email" className="email" style={{ outline: '0px' }} >
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

                        {/* Teléfono */}
                        <div className="floating-label">
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
                                   
                                />
                                <Form.Label>Número de teléfono</Form.Label>
                            </Form.Group>
                        </div>

                        
                        <Form.Group controlId="userStatusPro" className="userStatusPro">
                            <div className="icon-container">
                                <Form.Control
                                    as="select"
                                    name="userStatusPro"
                                    value={formData.userStatus === true ? 'AC' : 'IN'}
                                    onChange={(e) => {
                                        const { value } = e.target;
                                        setFormData({
                                          ...formData,
                                          userStatus: value === 'AC',  // Si es 'AC', asigna true; si es 'IN', asigna false
                                        });
                                      }}
                                    required
                                    style={{ border: 'none' }}
                                >
                                    <option value="" disabled>Estado</option>
                                    <option value="AC">Activo</option>
                                    <option value="IN">Inactivo</option>

                                </Form.Control>
                                <FontAwesomeIcon icon={faChevronDown} className="icon" />
                            </div>
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} className="order-2 order-sm-1">
                        {/* Usamos el componente ImageDropzone aquí */}
                        <div className="image-coponent order-3 order-sm-1">
                            <ImageDropzone
                                getRootProps={getRootProps}
                                getInputProps={getInputProps}
                                isDragActive={isDragActive}
                                image={image}
                                defaultImage={formData.pathImage || ''}

                            />
                        </div>
                    
                        {/* Dirección */}
                        <div className="floating-label order-2 order-sm-1">
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
                        {/* Roles */}
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
                        Actualizar Usuario
                    </Button>
                    <Button variant="secondary" className='button-no-register' disabled={loading} onClick={handleCancel} >
                        Cancelar actualización
                    </Button>
                </div>
            </Form>

            <ConfirmationModal
                show={showModal}
                onHide={handleCloseModal}
                onConfirm={handleConfirmAction}
                title={modalType === 'cancel' ? "Cancelar actialización" : "Confirmar Actulización"}
                bodyText={modalType === 'cancel'
                    ? "¿Deseas cancelar la actualización de la información del usuario? Las modificaciones realizadas no se guardarán."
                    : "¿Estás seguro de que deseas actualizar la información?"}
                confirmText = 'Si'//{modalType === 'cancel' ? "Sí, cancelar" : "Sí, actualizar"}
                cancelText = 'No'//{modalType === 'cancel' ? "No, no cancelar" : "No, no actualizar"}
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
