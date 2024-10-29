import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';

import './passwordChange.css';

function PasswordChange({ handleSubmit }) {
    const [email, setEmail] = useState('');
    const [captchaValue, setCaptchaValue] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Cargar dinámicamente el script de Google reCAPTCHA
        const script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        // Limpia el script cuando el componente se desmonte
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

    const onSubmit = (e) => {
        e.preventDefault();
        if (captchaValue) {
            setLoading(true);
            handleSubmit(email, captchaValue)
                .finally(() => setLoading(false));
        } else {
            alert('Por favor, completa el captcha.');
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
                        theme="light" // Cambiar a "dark" para el tema oscuro
                        size="normal" // Puedes cambiar a "compact" para tamaño pequeño
                    />
                </div>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Validar'}
                </Button>
            </Form>
        </div>
    );
}

export default PasswordChange;
