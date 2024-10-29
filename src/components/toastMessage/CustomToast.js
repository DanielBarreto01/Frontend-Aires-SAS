import React from 'react';
import "./CustomToast.css";
import { Toast, ToastContainer } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const CustomToast = ({ showToast, setShowToast, toastMessage, toastType }) => {

    return (
        <ToastContainer
            position="top-end"
            className="p-3"
            style={{ zIndex: 1050 }}
        >
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                bg={toastType === 'success' ? 'success' : 'danger'}
                delay={4000}
                autohide
                className="custom-toast"
                type={toastType}
            >
            <Toast.Header className={toastType === 'success' ? 'toast-header-success' : 'toast-header-error'}>
                <FontAwesomeIcon
                    icon={toastType === 'success' ? faCircleCheck : faTimesCircle}
                    style={{ marginRight: '8px', color: toastType === 'success' ? 'green' : 'red' }}
                />
                {/* <strong className="me-auto">{toastType === 'success' ? 'Éxito' : 'Error'}</strong> */}
                <strong className="me-auto">{toastMessage}</strong>
                {/* <small>Just now</small> */}
            </Toast.Header>
                {/* <Toast.Body className={toastType === 'success' ? 'toast-body-success' : 'toast-body-error'}>
                    {toastMessage}
                   </Toast.Body> */}
            </Toast>
        </ToastContainer>
    );
}

export default CustomToast;