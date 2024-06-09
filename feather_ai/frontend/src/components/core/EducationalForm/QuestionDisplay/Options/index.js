import React, { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import useStore from "../../../../../store";
import BasicText from "./OptionTypes/BasicText";
import { choice_types, option_types } from "../../../../../global_constants";
import { newAnswersMultiChoice } from "../../../../../utils";

export default function Options({
  choice_type,
  options,
  step,
  option_background_color,
}) {
  const { answer_sheet, setAnswerSheet } = useStore();
  const getAnswerValue = () => {
    if (
      !answer_sheet ||
      !answer_sheet["answers"] ||
      !answer_sheet["answers"][step]
    )
      return null;
    return answer_sheet["answers"][step]["filled_answer"];
  };

  const [optionStyles, setOptionStyles] = useState({});
  const default_option_style = {
    marginTop: "20px",
  };
  useEffect(() => {
    const calculateMermaidHeight = () => {
      const updatedOptionStyles = {};

      options.forEach((option) => {
        if (option.option_type === option_types["mermaid"]) {
          const mermaidElement = document.getElementById(
            `mermaid-${option.id}`
          );
          if (mermaidElement) {
            const mermaidHeight = mermaidElement.clientHeight;
            updatedOptionStyles[option.id] = {
              marginTop: `${20}px`,
              height: `${mermaidHeight}px`,
            };
          }
        }
      });

      if (Object.keys(updatedOptionStyles).length > 0) {
        let first_rendered_mermaid_measure =
          Object.values(updatedOptionStyles)[0];
        for (let key in updatedOptionStyles) {
          updatedOptionStyles[key] = first_rendered_mermaid_measure;
        }
        setOptionStyles(updatedOptionStyles);
      } else {
        setOptionStyles({});
      }
    };
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        calculateMermaidHeight();
      });
    }, 4000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [options]);

  const isChecked = (option) => {
    if (!option) return false;
    let filled_answer = getAnswerValue();
    if (!filled_answer || filled_answer.length === 0) return false;
    return filled_answer.includes(option);
  };

  const handleChange = (event) => {
    const newAnswerSheet = { ...answer_sheet };
    if (choice_type === choice_types["single_choice"]) {
      newAnswerSheet["answers"][step]["filled_answer"] = [event.target.value];
    } else if (choice_type === choice_types["multiple_choice"]) {
      let answer_id = event.target.name;
      let current_check_status = !event.target.checked;
      let filled_answer = newAnswersMultiChoice(
        current_check_status,
        newAnswerSheet["answers"][step]["filled_answer"],
        answer_id
      );
      newAnswerSheet["answers"][step]["filled_answer"] = filled_answer;
    }
    setAnswerSheet(newAnswerSheet);
  };

  return (
    <div>
      {choice_type === choice_types["single_choice"] ? (
        <RadioGroup onChange={handleChange}>
          {options.map((option, index) => (
            <React.Fragment>
              <FormControlLabel
                key={index}
                value={option.id}
                control={<Radio />}
                label={<BasicText option_id={option.id} text={option.value} />}
                style={{
                  ...(optionStyles[option.id] || default_option_style),
                  backgroundColor: option_background_color[option.id],
                }}
              />
            </React.Fragment>
          ))}
        </RadioGroup>
      ) : choice_type === choice_types["multiple_choice"] ? (
        <FormGroup>
          {options.map((option, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={isChecked(option.id)}
                  onChange={handleChange}
                  name={option.id}
                />
              }
              label={<BasicText option_id={option.id} text={option.value} />}
              style={{
                ...(optionStyles[option.id] || default_option_style),
                backgroundColor: option_background_color[option.id],
              }}
            />
          ))}
        </FormGroup>
      ) : (
        <p>Invalid choice_type</p>
      )}
    </div>
  );
}
