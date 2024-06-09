import React, { useEffect, useState } from "react";
import useStore from "../../../../store";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Options from "./Options";
import ResultScreen from "./ResultScreen";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { background_color_types } from "../../../../global_constants";
import { getBackgroundColorByFilledAnswers } from "../../../../utils";

export default function QuestionDisplay({ step }) {
  const { template, answer_sheet } = useStore();
  const [question, setQuestion] = useState({});
  const [resultChecked, setResultChecked] = useState(false);
  const [option_background_color, setOptionBackgroundColor] = useState({});
  useEffect(() => {
    setQuestion(template.questions[step]);
    setResultChecked(false);
    let { questions } = template;
    if (step < questions.length) {
      let { options } = questions[step];
      let background_color = {};
      for (const option of options) {
        background_color[option["id"]] = background_color_types["basic"];
      }
      setOptionBackgroundColor(background_color);
    }
  }, [step]);
  const checkKeys = () => {
    let available_keys = ["question_title", "options", "answer", "choice_type"];
    return available_keys.every((key) => question.hasOwnProperty(key));
  };
  const checkResult = () => {
    let { answers } = answer_sheet;
    let { questions } = template;
    let { filled_answer } = answers[step];
    let { answer } = questions[step];
    setOptionBackgroundColor(
      getBackgroundColorByFilledAnswers(
        answer,
        filled_answer,
        option_background_color
      )
    );
    setResultChecked(true);
  };
  return (
    <div>
      {question && checkKeys() ? (
        <React.Fragment>
          <FormControl disabled={resultChecked}>
            <FormLabel
              id="radio-buttons-group-label"
              style={{ fontSize: "20px", color: "#333" }}
            >
              {question["question_title"]}
            </FormLabel>
            <Options
              choice_type={question["choice_type"]}
              options={question["options"]}
              step={step}
              option_background_color={option_background_color}
            />
            <Button
              onClick={checkResult}
              disabled={resultChecked}
              style={{ margin: "20px" }}
              variant="outlined"
            >
              Check Result
            </Button>
          </FormControl>
          {resultChecked &&
          template &&
          template.questions &&
          step < template.questions.length ? (
            <div>
              <Typography variant="h6">Explaination</Typography>
              <Typography variant="body1">
                {template["questions"][step]["answer_explaination"]}
              </Typography>
            </div>
          ) : null}
        </React.Fragment>
      ) : (
        <ResultScreen />
      )}
    </div>
  );
}
