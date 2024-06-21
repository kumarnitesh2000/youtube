import "./styles.css";
import NavBar from "./components/NavBar";
import UploadTemplate from "./components/UploadTemplate";
import React, { useEffect, useState } from "react";
import EducationalForm from "./components/core/EducationalForm";
import AI from "./components/AI";
export default function App() {
  const [template, setTemplate] = useState(null);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const template = queryParams.get("template");
    setTemplate(template);
  }, []);
  const [jsonContent,setJSONContent] = useState(null); 
  return (
    <div>
      {!template ? (
        <div>
          <NavBar />
          <UploadTemplate content={jsonContent}/>
          <AI setJSONContent={setJSONContent}/>
        </div>
      ) : (
        <EducationalForm encoded_template={template} />
      )}
    </div>
  );
}
