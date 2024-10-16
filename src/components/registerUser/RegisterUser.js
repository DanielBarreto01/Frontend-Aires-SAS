import React, { useState } from 'react';
import './RegisterUser.css';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons';

//import { toast } from 'sonner'
function RegisterUser() {
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        typeIdentification: '',
        numberIdentification: '',
        email: '',
        phoneNumber: '',
        address:'',
        roles: [] // Aquí guardamos múltiples roles seleccionados
      });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        // Si el campo es email, eliminamos los espacios en blanco
        setFormData({
          ...formData,
          [name]: name === 'email' ? value.replace(/\s/g, '') : value,
        });
    };
    

    

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí podrías manejar el envío del formulario (guardar datos, hacer una petición, etc.)
        console.log('Form Data:', formData);
    };

      const handleCancel = () => {
        // Restablecemos los datos del formulario a su estado inicial
        setFormData({
            name: '',
            lastName: '',
            typeIdentification: '',
            numberIdentification: '',
            email: '',
            phoneNumber: '',
            address:'',
            roles: [],
        });
      };
    
      return (
        <div className="col-md-5 register-container row justify-content-center  d-flex shadow-lg" >
            <div className='formu'>
                <h2>Registro de Usuario</h2>
                <Form onSubmit={handleSubmit}>
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
                                    />
                                    <Form.Label>Apellidos</Form.Label>
                                </Form.Group>
                            </div>
                        </Col>
                    </Row>
                    <Form.Group controlId="typeIdentification" className="typeIdentification">
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
                                <option value="NIT">NIT</option>
                            </Form.Control>
                            <FontAwesomeIcon icon={faChevronDown} className="icon" />    
                        </div>
                    </Form.Group>

                    <div className="floating-label">
                        <Form.Group controlId="numberIdentification"className="numberIdentification">
                            {/* <Form.Label>Number Identification</Form.Label> */}
                            <Form.Control
                            type="text"
                            name="numberIdentification"
                            value={formData.numberIdentification}
                            onChange={handleInputChange}
                            placeholder=""
                            required
                            />
                            <Form.Label>Número de identificación</Form.Label>
                        </Form.Group>
                    </div>

                    <div className="floating-label">
                        <Form.Group controlId="email" className="email" style={{outline: '0px'}} >
                            {/* <Form.Label>Email</Form.Label> */}
                            <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder=""
                            required
                            />
                            <Form.Label>Correo electrónico</Form.Label>
                        </Form.Group>
                    </div>
                    
                    <div className="floating-label">
                        <Form.Group controlId="phoneNumber" className="phoneNumber">
                            {/* <Form.Label>Phone Number</Form.Label> */}
                            <Form.Control
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder=""
                            required
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
                            />
                            <Form.Label>Dirección</Form.Label>
                        </Form.Group>
                    </div>
                
                    <Form.Group controlId="roles" className ="roles"> 
                      
                        <div className="icon-container">
                        <Form.Control
                        as="select"
                            name="roles"
                            value={formData.roles[0] || ''}  // Usamos el primer valor del arreglo (o cadena vacía si no hay nada)
                            onChange={handleInputChange}
                            required
                            style={{ border: 'none' }} 
                            >
                            <option value="" disabled>Rol</option>
                            <option value="ADMIN">Administrador</option>
                            <option value="USER">USER</option>
                            <option value="SUPPORT">SUPPORT</option>
                        </Form.Control>
                        <FontAwesomeIcon icon={faChevronDown} className="icon" />    
                    </div>
                </Form.Group>
                <div className="button-group">
                    <Button variant="primary" type="submit" className='button-register'>
                        Registrar Usuario
                    </Button> 
                    <Button variant="secondary" className='button-no-register' onClick={handleCancel}>
                        Cancelar Registro
                    </Button>
                </div>
                </Form>
            </div>         
        </div>      
      );
}

export default RegisterUser;