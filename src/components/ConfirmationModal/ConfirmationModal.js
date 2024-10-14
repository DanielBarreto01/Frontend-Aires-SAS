import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ConfirmationModal({ show, onHide, onConfirm, title, bodyText, confirmText, cancelText }) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title className="w-100 text-center">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                {bodyText}
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
                <Button variant="secondary" onClick={onHide}>
                    {cancelText}
                </Button>
                <Button variant="primary" onClick={onConfirm}>
                    {confirmText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmationModal;
