
import React from 'react';
import './Admincss/ConfirmationModal.css'; 

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="confirmation-modal">
            <div className="confirmation-content">
                <p>{message}</p>
                <button onClick={onConfirm}>Yes</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default ConfirmationModal;
