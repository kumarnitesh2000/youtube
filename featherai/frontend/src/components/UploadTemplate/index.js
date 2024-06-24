import React, { useState,useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { encodeData } from "../../utils";
import ExampleTemplate from "../ExampleTemplate";
import BackupIcon from '@mui/icons-material/Backup';
const UploadTemplate = ({content}) => {
  const [jsonContent, setJsonContent] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          setJsonContent(encodeData(json));
        } catch (error) {
          console.error("Invalid JSON file:", error);
          setJsonContent(null);
        }
      };
      reader.readAsText(file);
    } else {
      console.error("Please upload a valid JSON file");
      setJsonContent(null);
    }
  };
  useEffect(() => {
    if(content!=null)
    setJsonContent(encodeData(content));
  },[content]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
        fontFamily: "Raleway",
      }}
    >
      <Button variant="contained" component="label" endIcon={<BackupIcon />}>
        Upload Quiz Template
        <input
          type="file"
          accept="application/json"
          hidden
          onChange={handleFileUpload}
        />
      </Button>
      <br />
      <ExampleTemplate />
      <br />
      {jsonContent ? (
        <Button
          variant="contained"
          component="label"
          endIcon={<ArrowOutwardIcon />}
          onClick={() => window.open(`/?template=${jsonContent}`, "_blank")}
        >
          View
        </Button>
      ) : null}
    </Box>
  );
};

export default UploadTemplate;
