import React, { useEffect, useState } from "react";
import useStore from "../../../../../store";
import { getResults } from "../../../../../utils";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Link from "@mui/material/Link";
import { styled } from "@mui/system";

const CorrectIcon = styled("span")({
  color: "green",
});

const IncorrectIcon = styled("span")({
  color: "red",
});

const LearnMoreLink = styled(Link)({
  marginLeft: 8,
  color: "blue",
  textDecoration: "underline",
});

export default function ResultScreen() {
  const { answer_sheet, template } = useStore();
  const [result, setResult] = useState({});

  useEffect(() => {
    let _result = getResults(answer_sheet, template);
    setResult(_result);
  }, [answer_sheet, template]);

  const noIncorrectAnswers =
    !Array.isArray(result.incorrect) || result.incorrect.length === 0;
  const noCorrectAnswers =
    !Array.isArray(result.correct) || result.correct.length === 0;

  return (
    <div>
      {noCorrectAnswers ? null : (
        <div>
          <Typography variant="h4">
            Correct Answers
            {noCorrectAnswers ? null : <CorrectIcon>✅</CorrectIcon>}
          </Typography>
          <List>
            {Array.isArray(result.correct) &&
              result.correct.map((item, index) => (
                <ListItem key={index}>
                  <CorrectIcon>✅</CorrectIcon>
                  <ListItemText>{item.question_title}</ListItemText>
                </ListItem>
              ))}
          </List>
        </div>
      )}

      {noIncorrectAnswers ? null : (
        <div>
          <Typography variant="h4">
            Incorrect Answers
            {noIncorrectAnswers ? null : <IncorrectIcon>❌</IncorrectIcon>}
          </Typography>
          <List>
            {Array.isArray(result.incorrect) &&
              result.incorrect.map((item, index) => (
                <ListItem key={index}>
                  <IncorrectIcon>❌</IncorrectIcon>
                  <ListItemText>
                    {item.question_title}
                    {item.tutorial_link && (
                      <LearnMoreLink
                        href={item.tutorial_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Learn more
                      </LearnMoreLink>
                    )}
                  </ListItemText>
                </ListItem>
              ))}
          </List>
        </div>
      )}

      {noCorrectAnswers && noIncorrectAnswers ? (
        <Typography variant="h4">No Answers Provided</Typography>
      ) : null}
    </div>
  );
}
