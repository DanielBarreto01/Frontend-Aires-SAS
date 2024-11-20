
import React, { useState } from "react";
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
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

    const [dropdownState, setDropdownState] = useState({
        typeEquipment: false,
    });

    const handleDropdownToggle = (controlId) => {
        setDropdownState((prevState) => ({
            ...prevState,
            [controlId]: !prevState[controlId]
        }));
    };
    return (
        <div className='row' >
            <div className='col-12 col-lg-6 title1 ' style={{ marginBottom: '15px' }}>
                <h2 className="text-start title">Información equipo</h2>
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
                                disabled={!isEditing}

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
                                        disabled={!isEditing}
                                        className={!isEditing ? 'input-disabled' : ''}
                                        style={{ border: 'none' }}
                                        onClick={() => handleDropdownToggle("typeEquipment")}
                                    >
                                        <option value="" disabled>Tipo de equipo</option>
                                        <option value="CONDENSADOR">Condensador</option>
                                        <option value="SECADOR">Secador</option>

                                    </Form.Control>
                                    <FontAwesomeIcon
                                        icon={dropdownState.typeEquipment ? faChevronDown : faChevronUp} // Ícono dinámico
                                        className="icon-selector"
                                    />
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
                                            disabled={!isEditing}
                                            className={!isEditing ? 'input-disabled' : ''}
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
                                            disabled={!isEditing}
                                            className={!isEditing ? 'input-disabled' : ''}
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
                                            onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa un número de serial valido valido.')}
                                            onInput={(e) => e.target.setCustomValidity('')}
                                            disabled={!isEditing}
                                            className={!isEditing ? 'input-disabled' : ''}
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
                                            disabled={!isEditing}
                                            className={!isEditing ? 'input-disabled' : ''}
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
                                            disabled={!isEditing}
                                            className={!isEditing ? 'input-disabled' : ''}
                                        />
                                        <Form.Label>Número en iventario</Form.Label>
                                    </Form.Group>
                                </div>

                                <div className=" col-12">
                                    {isEditing ? (
                                        <>
                                            <div className="button-group">
                                                <button type="submit" className='button-confirmationn' disabled={isEditingButtons}>
                                                    Guardar cambios
                                                </button>

                                                <button type= "button" className='button-cancell' onClick={handleCancel} disabled={isEditingButtons}>
                                                    Cancelar edición
                                                </button>

                                            
                                            </div>

                                        </>
                                    ) : (
                                        <>
                                            <div className="button-group">
                                                <button type="button" className='button-confirmationn' disabled={isEditingButtons}  onClick={handleEditClick}>
                                                    Editar
                                                </button>
                                                <button type="button" className='button-cancell'  disabled={isEditingButtons} onClick={handleShowListEquipment}>
                                                    Regresar
                                                </button>


                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                show={showModal}
                onHide={handleCloseModal}
                onConfirm={handleConfirmAction}
                title={modalType === 'cancel' ? "Cancelar actialización" : "Confirmar Actulización"}
                bodyText={modalType === 'cancel'
                    ? "¿Deseas cancelar la actualización de la información del equipo? Las modificaciones realizadas no se guardarán."
                    : "¿Estás seguro de que deseas actualizar la información?"}
                confirmText='Si'
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

export default UpdateEquipmentForm;
