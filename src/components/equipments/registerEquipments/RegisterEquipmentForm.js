import React from 'react';
import { Form, Button, Row, Col, Image, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import ImageDropzone from '../../loadImage/ImageDropzone';
import './RegisterEquipment.css';
import "../../general.css";

function RegisterEquipmentForm({ formData,
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
        <div className='row' >
            <div className='col-12 col-lg-6 title1 ' style={{ marginBottom: '15px' }}>
                <h2 className="text-start title">Registro de Equipo</h2>
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
                            />
                        </div>


                        <div className='floating-label'>
                            <Form.Group controlId="equipmentType" className="roles">
                                <div className="icon-container">
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
                                    <FontAwesomeIcon icon={faChevronDown} className="icon-selector" />
                                    {/* <FontAwesomeIcon icon={faChevronDown} /> */}
                                </div>
                            </Form.Group>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6 form ">
                        <Form onSubmit={handleSubmit}>
                            <div className='row'>
                                <div className="floating-label col-12 "  >
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
                                            onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un nombre valido.')}
                                            onInput={(e) => e.target.setCustomValidity('')}

                                        />
                                        <Form.Label>Nombre del equipo:</Form.Label>
                                    </Form.Group>

                                </div>

                                <div className="floating-label col-12 ">
                                    <Form.Group controlId="modelNumber" className="email">
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

                                <div className="floating-label col-12 ">
                                    <Form.Group controlId="serialNumber" className="email">
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

                                <div className="floating-label col-12 ">
                                    <Form.Group controlId="brand" className="email">
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
                                <div className="floating-label col-12 ">
                                    <Form.Group controlId="iventoryNumber" className="email">
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

                            </div>

                            <div className=" col-12 button-group">
                                <button type="submit" className='button-confirmationn'  disabled={isEditingButtons}>
                                    Registrar equipo
                                </button>
                                <button className='button-cancell' onClick={handleCancel} disabled={isEditingButtons}>
                                    Cancelar Registro
                                </button>


                            </div>
                        </Form>

                    </div>

                </div>
            </div>

            <ConfirmationModal
                show={showModal}
                onHide={handleCloseModal}
                onConfirm={handleConfirmAction}
                title={modalType === 'cancel' ? "Cancelar registro" : "Confirmar registro"}
                bodyText={modalType === 'cancel'
                    ? "¿Estás seguro de que deseas cancelar el registro? Se perderán todos los datos."
                    : "¿Estás seguro de que deseas registrar este equipo?"}
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
export default RegisterEquipmentForm;
