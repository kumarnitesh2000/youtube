import React, { useState } from 'react';
import { TextField, IconButton, TextareaAutosize } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const AI = ({setJSONContent}) => {
    const [inputValue, setInputValue] = useState('');
    const API_ENDPOINT = "http://localhost:8000/generate";
    const generateQuiz = () => {
        if (inputValue.trim().length === 0) {
            alert('Input value is empty or contains only spaces');
            return;
        }
        fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_query: inputValue
            })
        })
        .then(response => response.json())
        .then(data => setJSONContent(data))
        .catch(error => console.error('Error:', error));
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <TextField
                placeholder="Enter Query to create Quiz"
                value={inputValue} 
                onChange={handleInputChange}
                InputProps={{
                    endAdornment: (
                        <IconButton onClick={generateQuiz}>
                            <ArrowOutwardIcon />
                        </IconButton>
                    ),
                }}
            />
        </div>
    );
};

export default AI;