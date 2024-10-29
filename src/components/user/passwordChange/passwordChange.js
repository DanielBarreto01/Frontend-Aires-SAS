import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import CustomToast from '../../toastMessage/CustomToast'; // Importa CustomToast
import './passwordChange.css';

function PasswordChange() {
    const [email, setEmail] = useState('');
    const [captchaValue, setCaptchaValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState(''); // Puede ser 'success' o 'error'

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    const handleSubmit = async (email) => {
        try {
            await axios.post('/reset-password/create', {
                email: email,
            });

            setToastMessage('Email enviado exitosamente');
            setToastType('success');
            setShowToast(true);
        } catch (error) {
            setToastMessage('Hubo un error al enviar el email. Inténtalo de nuevo.');
            setToastType('error');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (captchaValue) {
            setLoading(true);
            handleSubmit(email);
        } else {
            setToastMessage('Por favor, completa el captcha.');
            setToastType('error');
            setShowToast(true);
        }
    };

    return (
        <div className="email-captcha-form">
            <div className="title-container">
                <h2>Validación de Correo</h2>
            </div>
            <Form onSubmit={onSubmit}>
                <Form.Group controlId="email" className="floating-label">
                    <Form.Control
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder=" "
                        required
                        maxLength={70}
                    />
                    <Form.Label>Correo electrónico</Form.Label>
                </Form.Group>
                <div className="captcha-container">
                    <ReCAPTCHA
                        sitekey="6LeZvm8qAAAAAOsSAyEy6RL-5mUZ36eN_3CFGWol"
                        onChange={handleCaptchaChange}
                        theme="light"
                        size="normal"
                    />
                </div>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Validar'}
                </Button>
            </Form>

            {/* Muestra el CustomToast */}
            <CustomToast
                showToast={showToast}
                setShowToast={setShowToast}
                toastMessage={toastMessage}
                toastType={toastType}
            />
        </div>
    );
}

export default PasswordChange;
