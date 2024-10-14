import React, { useState, useContext } from 'react';
import { Spinner } from 'react-bootstrap';
import { AuthContext } from './AuthContext'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import logo from './fondo_icon.png';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { handleLogin } = useContext(AuthContext);
  const [userName, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [navigation, setNavigation] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Inicia la carga
    try {
      const token = await handleLogin(userName, password);
      localStorage.setItem('authToken', token); // Almacenar el token en localStorage
      setError(''); // Limpiar el error si todo va bien
      setNavigation(<Navigate to="/admin" />); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Detiene la carga independientemente de si hubo un error o no
    }
  };
  
  return (
    <div className="login-container row justify-content-center aling-items-center d-flex shadow-lg" id ='login-container' >
      <div className="margin-le">   </div>
      <div className="col-md-6 login-logo">
          {/* Aquí puedes agregar la imagen del logo */}
          <img src={logo} alt="P&A Logo" className="responsive-logo" />
      </div>
      <div className="col-md-6 login-form" >
        <div className = "row cont-1"></div>
        <div className = "formualrio row" id = "formualrio">
        <h2>Bienvenido</h2>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <input 
                placeholder="Correo electrónico o usuario" 
                value={userName}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña" 
                required 
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>} {/* Mostrar el error aquí */}

            <div className="button-container">
              <button type="submit" className="login-btn">Login</button>
            {navigation}
          </div>
            <div className = "resett-password">
              <small><a href="/forgot-password" className="forgot-password">¿Olvidaste tu contraseña?</a></small>
            </div>
          </form>
          
        </div>
        <div className = "row"></div>
      </div>
      {loading && ( // Si está cargando, muestra el overlay y el spinner
        <div className="loading-overlay">
          <Spinner animation="border" size="lg" /> {/* Tamaño grande para mayor visibilidad */}
        </div>
      )}
    </div>
  );
};

export default Login;
