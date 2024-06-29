import React, { useEffect, useState } from "react";
import { optional_brand_config } from "../../global_constants";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import useStore from "../../store";
import QuestionDisplay from "./QuestionDisplay";
import { ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import Grid from "@mui/material/Grid";
import customTheme from "../../theme";

export default function EducationalForm({ quiz_template }) {
  const { template, setTemplate, setAnswerSheet } = useStore();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setTemplate(quiz_template);
  }, [quiz_template]);

  const getAnswerSheetTemplate = () => {
    let answerSheetTemplate;
    const answersArray = template.questions.map(() => ({
      filled_answer: [],
    }));
    answerSheetTemplate = { answers: answersArray };
    return answerSheetTemplate;
  };
  const [brandConfig, setBrandConfig] = useState(optional_brand_config);
  useEffect(() => {
    if (template && template.questions) {
      setAnswerSheet(getAnswerSheetTemplate());
    }
    if (template && template.brand_config) {
      setBrandConfig(template.brand_config);
    }
  }, [template]);

  const handleNext = () => {
    if (activeStep <= template.questions.length - 1)
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    else {
      setActiveStep(0);
      setAnswerSheet(getAnswerSheetTemplate());
    }
  };
  return (
    <ThemeProvider theme={customTheme(brandConfig["brand_main_color"])}>
      <div>
        <Box sx={{ width: "100%" }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={2}>
              <img
                src={"/img/logo.svg"}
                alt={"logo"}
                style={{ width: "70px", height: "70px" }}
              />
            </Grid>
            <Grid item xs={12} sm={10}>
              {template &&
              template.quiz_title &&
              template.quiz_title.length > 0 ? (
                <Typography
                  variant="h5"
                  style={{ fontWeight: "bold", marginTop: "10px" }}
                >
                  {template.quiz_title}
                </Typography>
              ) : (
                ""
              )}
            </Grid>
          </Grid>
          {template && template.questions ? (
            <React.Fragment>
              <Stepper activeStep={activeStep}>
                {template.questions.map((question, index) => {
                  const labelProps = {};
                  return (
                    <Step key={index}>
                      <StepLabel {...labelProps}></StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <QuestionDisplay step={activeStep} />
              <Button
                onClick={handleNext}
                variant="contained"
                style={{ margin: "30px" }}
                endIcon={<NavigateNextRoundedIcon />}
              >
                {activeStep > template.questions.length - 1
                  ? "Retry Quiz"
                  : activeStep === template.questions.length - 1
                  ? "Check Results"
                  : "Next"}
              </Button>
            </React.Fragment>
          ) : (
            <>Loading Template</>
          )}
        </Box>
      </div>
    </ThemeProvider>
  );
}
