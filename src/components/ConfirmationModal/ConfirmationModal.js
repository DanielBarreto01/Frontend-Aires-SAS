import React, { useRef, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ConfirmationModal.css';

function ConfirmationModal({ show, onHide, onConfirm, title, bodyText, confirmText, cancelText, containerId }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerId) {
            containerRef.current = document.getElementById(containerId);
        }
    }, [containerId]);

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            container={containerRef.current}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
            <Modal.Header closeButton>
                <Modal.Title className="w-100 text-center">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                {bodyText}
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
                <Button className='button-secudary' onClick={onConfirm}>
                    {confirmText}
                </Button>
                <Button className="custom-button" onClick={onHide}>
                    {cancelText}
                </Button>

            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmationModal;