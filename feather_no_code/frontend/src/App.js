import "./styles.css";
import EducationalForm from "./components/EducationalForm";
import template from "./sample";
import React from "react";
export default function App() {
  return (
    <div>
      <EducationalForm quiz_template={template} />
    </div>
  );
}
