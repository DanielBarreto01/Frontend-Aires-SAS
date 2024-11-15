import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { Spinner } from 'react-bootstrap';
import CustomToast from './CustomToast';

const Login = () => {
    const { handleLogin } = useContext(AuthContext);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = await handleLogin(userName, password);
            localStorage.setItem('authToken', token);
            navigate('/dashboard'); // Redirige al dashboard después de iniciar sesión
        } catch (error) {
            setToastMessage(error.message);
            setToastType('error');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="userName">Usuario</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Iniciar sesión'}
                    </button>
                    <div className="resett-password">
                        <small>
                            <a href="/forgot-password" className="forgot-password" onClick={(e) => {
                                e.preventDefault();
                                navigate('/change-password');
                            }}>¿Olvidaste tu contraseña?</a>
                        </small>
                    </div>
                </form>
            </div>
            {loading && (
                <div className="loading-overlay">
                    <Spinner animation="border" size="lg" />
                </div>
            )}
            <CustomToast
                showToast={showToast}
                setShowToast={setShowToast}
                toastMessage={toastMessage}
                toastType={toastType}
            />
        </div>
    );
};

export default Login;