import React from 'react';
import './login.css';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-logo">
        {/* Aquí puedes agregar la imagen del logo */}
        <img src="ruta-a-la-imagen/logo.png" alt="P&A Logo" />
      </div>
      <div className="login-form">
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
            <span className="show-password">👁️</span>
          </div>
          <button type="submit" className="login-btn">Login</button>
          <a href="/forgot-password" className="forgot-password">¿Olvidaste tu contraseña?</a>
        </form>
      </div>
    </div>
  );
};

export default Login;
