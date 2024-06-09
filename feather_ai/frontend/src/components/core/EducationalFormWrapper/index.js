import React, { useEffect, useState } from "react";
import EducationalForm from "../EducationalForm";
import { encodeData } from "../../../utils";

export default function EducationalFormWrapper({ quiz_template }) {
  const [encodedTemplate, setEncodedTemplate] = useState("");

  useEffect(() => {
    if (quiz_template) {
      setEncodedTemplate(encodeData(quiz_template));
    }
  }, []);
  return (
    <div>
      {encodedTemplate ? (
        <EducationalForm encoded_template={encodedTemplate} />
      ) : null}
    </div>
  );
}
