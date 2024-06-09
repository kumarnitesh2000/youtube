import "./styles.css";
import NavBar from "./components/NavBar";
import UploadTemplate from "./components/UploadTemplate";
import React, { useEffect, useState } from "react";
import EducationalForm from "./components/core/EducationalForm";
export default function App() {
  const [template, setTemplate] = useState(null);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const template = queryParams.get("template");
    setTemplate(template);
  }, []);
  return (
    <div>
      {!template ? (
        <>
          <NavBar />
          <UploadTemplate />
        </>
      ) : (
        <EducationalForm encoded_template={template} />
      )}
    </div>
  );
}
