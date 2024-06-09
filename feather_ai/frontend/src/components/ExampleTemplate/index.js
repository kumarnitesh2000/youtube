import React from 'react';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
const ExampleTemplate = () => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `${process.env.PUBLIC_URL}/quiz.json`;
    link.download = 'quiz.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div> 
      <Button onClick={handleDownload} endIcon={<DownloadIcon />}>
        Download Example Template
      </Button>
    </div>
  );
};

export default ExampleTemplate;
