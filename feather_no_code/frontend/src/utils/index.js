import { background_color_types } from "../global_constants";

const newAnswersMultiChoice = (
  current_check_status,
  filled_answers,
  option_id
) => {
  const newFilledAnswers = [...filled_answers];
  if (current_check_status) {
    const indexToRemove = newFilledAnswers.indexOf(option_id);
    if (indexToRemove !== -1) {
      newFilledAnswers.splice(indexToRemove, 1);
    }
  } else {
    if (!newFilledAnswers.includes(option_id)) {
      newFilledAnswers.push(option_id);
    }
  }
  return newFilledAnswers;
};

const isAnswerCorrect = (filled_answer, answer) => {
  if (filled_answer.length !== answer.length) {
    return false;
  }
  const sortedFilledAnswer = filled_answer.slice().sort();
  const sortedAnswer = answer.slice().sort();
  return sortedFilledAnswer.every(
    (element, index) => element === sortedAnswer[index]
  );
};

const getResults = (_answer_sheet, _template) => {
  let { answers } = _answer_sheet;
  let { questions } = _template;
  // base case
  if (!answers || !questions) return null;
  // result template
  let result = {
    correct: [],
    incorrect: [],
  };
  let number_of_questions = answers.length;
  for (let index = 0; index < number_of_questions; index++) {
    let { answer } = questions[index];
    let { filled_answer } = answers[index];
    if (isAnswerCorrect(answer, filled_answer)) {
      result["correct"].push(questions[index]);
    } else {
      result["incorrect"].push(questions[index]);
    }
  }
  return result;
};

const checkOptionFilledStatus = (option_id, answer, filled_answer) => [
  answer.includes(option_id) ? 1 : 0,
  filled_answer.includes(option_id) ? 1 : 0,
];

const getBackgroundColorByFilledAnswers = (
  answer,
  filled_answer,
  default_background_color
) => {
  let [incorrect, correct, basic] = Object.values(background_color_types);
  let color_matrix = [
    [basic, incorrect],
    [correct, correct],
  ];
  let new_background_color = default_background_color;
  for (let key in default_background_color) {
    let presence_status = checkOptionFilledStatus(key, answer, filled_answer);
    new_background_color[key] =
      color_matrix[presence_status[0]][presence_status[1]];
  }
  return new_background_color;
};
export {
  getBackgroundColorByFilledAnswers,
  getResults,
  newAnswersMultiChoice,
};
