import React, { useState } from 'react';
import axios from 'axios';

const EditModal = ({ itemId, setupdate, initialName, initialDescription, onClose, onEdit }) => {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);

    const handleEdit = () => {
        axios.put(`https://dataneuron2.onrender.com/api/update/${itemId}`, { name, description })
            .then(response => {
                console.log('Item updated successfully');
                console.log(response)
                setupdate(+response.data.update)
                alert("Task Updated")
                onEdit();
                onClose();
            })
            .catch(error => {
                console.error('Error updating item:', error);
            });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2 style={{ textDecoration: "underline" }}>Edit Item</h2>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <button style={{ padding: "3px", backgroundColor: "teal", color: "white" }} onClick={handleEdit}>Save</button>
            </div>
        </div>
    );
};

export default EditModal;
