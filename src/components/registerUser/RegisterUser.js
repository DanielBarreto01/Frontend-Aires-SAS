import React, { useState } from 'react';
import './RegisterUser.css';
import { Form, Button, Row, Col } from 'react-bootstrap';

//import { toast } from 'sonner'
function RegisterUser() {
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        typeIdentification: '',
        numberIdentification: '',
        email: '',
        phoneNumber: '',
        roles: [] // Aquí guardamos múltiples roles seleccionados
      });

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Si el campo es roles, convertimos el valor en un array
        if (name === 'roles') {
          setFormData({
            ...formData,
            [name]: [value],  // Almacenamos siempre como un array
          });
        } else {
          setFormData({
            ...formData,
            [name]: value,
          });
        }
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
          roles: [],
        });
      };
    
      return (
        <div className="login-container row justify-content-center  d-flex shadow-lg" id ='login-container' >
            <div className='formu'>
                <h2>Registro de Usuario</h2>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="name">
                                {/* <Form.Label>Name</Form.Label> */}
                                <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Nombres"
                                required
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={6}>
                            <Form.Group controlId="lastName" >
                                {/* <Form.Label>Last Name</Form.Label> */}
                                <Form.Control
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Apellidos"
                                required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="typeIdentification" className="form-group">
                        {/* <Form.Label>Type of Identification</Form.Label> */}
                            <Form.Control
                            as="select"
                            name="typeIdentification"
                            value={formData.typeIdentification}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled>Tipo de identificación</option> {/* Opción predeterminada */}
                            <option value="CC">CC</option>
                            <option value="CE">CE</option>
                            <option value="NIT">NIT</option>
                        </Form.Control>
                    </Form.Group>
                
                    <Form.Group controlId="numberIdentification"className="form-group">
                        {/* <Form.Label>Number Identification</Form.Label> */}
                        <Form.Control
                        type="text"
                        name="numberIdentification"
                        value={formData.numberIdentification}
                        onChange={handleInputChange}
                        placeholder="Número de identificación"
                        required
                        />
                    </Form.Group>
                
                    <Form.Group controlId="email" className="form-group" style={{ marginBottom:'-10px' }}>
                        {/* <Form.Label>Email</Form.Label> */}
                        <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Correo electrónico"
                        required
                        />
                    </Form.Group>
                
                    <Form.Group controlId="phoneNumber"className="form-group">
                        {/* <Form.Label>Phone Number</Form.Label> */}
                        <Form.Control
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Número de teléfono"
                        required
                        />
                    </Form.Group>

                    <Form.Group controlId="address" className="form-group">
                        {/* <Form.Label>Phone Number</Form.Label> */}
                        <Form.Control
                        type="text"
                        name="address"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Dirección"
                        required
                        />
                    </Form.Group>
                
                    <Form.Group controlId="roles" className ="form-group"> 
                        {/* <Form.Label>Select Role</Form.Label> */}
                        <Form.Control
                        as="select"
                        name="roles"
                        value={formData.roles[0] || ''}  // Usamos el primer valor del arreglo (o cadena vacía si no hay nada)
                        onChange={handleInputChange}
                        required
                        >
                        <option value="" disabled>Rol</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="USER">USER</option>
                        <option value="SUPPORT">SUPPORT</option>
                    </Form.Control>
                </Form.Group>
                <div className="button-group">
                    <Button variant="primary" type="submit">
                        Registrar Usuario
                    </Button> 
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancelar Registro
                    </Button>
                </div>
                </Form>
            </div>         
        </div>      
      );
}

export default RegisterUser;