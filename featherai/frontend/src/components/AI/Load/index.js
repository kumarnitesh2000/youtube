import React, { useState } from 'react';
import { Button } from '@mui/material';
const Load = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData
            });
            alert('File uploaded successfully!');
        } catch (error) {
            alert('Error uploading file. Please try again.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "50px",fontFamily: "Raleway"}}>
            <input type="file" onChange={handleFileChange} />
            <Button onClick={handleUpload} variant="contained">Load Document</Button>
        </div>
    );
};

export default Load;