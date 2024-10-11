import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import logo from './fondo_icon.png';

const Login = () => {
  return (
    <div className="login-container justify-content-center aling-items-center d-flex shadow-lg" id ='login-container' >
      <div className="col-md-6 login-logo">
          {/* Aquí puedes agregar la imagen del logo */}
          <img src={logo} alt="P&A Logo" />
      </div>
      <div className="col-md-6 login-form" >
        <div class = "row cont-1"></div>
        <div class = "formualrio row" id = "formualrio">
        <h2>Bienvenido</h2>
          <form>
            <div className="form-group">
              <input 
                type="email" 
                placeholder="Correo electrónico o usuario" 
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="password" 
                placeholder="Contraseña" 
                required 
              />
            </div>
          </form>
          <div className="button-container">
            <button type="submit" className="login-btn">Login</button>
          </div>
            <small><a href="/forgot-password" className="forgot-password">¿Olvidaste tu contraseña?</a></small>
        </div>
        <div class = "row"></div>
        
      </div>
    </div>
  );
};

export default Login;
