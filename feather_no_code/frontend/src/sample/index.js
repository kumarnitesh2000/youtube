const template = {
  quiz_title: "Knowledge check on ChatGPT",
  brand_config: {
    brand_main_color: "#7f7fd6",
  },
  questions: [
    {
      question_title: "What are some of the limitations of ChatGPT?",
      choice_type: "multiple_choice",
      options: [
        {
          id: "e8aa4216",
          option_type: "text",
          value:
            "ChatGPT sometimes writes plausible-sounding but incorrect answers.",
        },
        {
          id: "77901222",
          option_type: "text",
          value:
            "ChatGPT is sensitive to tweaks to the input phrasing or attempting the same prompt multiple times.",
        },
        {
          id: "3c9f8363",
          option_type: "text",
          value: "None of the Above",
        },
      ],
      answer: ["e8aa4216", "77901222"],
      tutorial_link:
        "https://www.forbes.com/sites/bernardmarr/2023/03/03/the-top-10-limitations-of-chatgpt/?sh=441d55168f35",
      answer_explaination:
        "ChatGPT is a large language model, but it is still under development. As a result, it has some limitations.",
    },
    {
      question_title: "What is ChatGPT?",
      choice_type: "single_choice",
      options: [
        {
          id: "12",
          option_type: "text",
          value: "A chatbot that can hold conversations with humans.",
        },
        {
          id: "13",
          option_type: "text",
          value:
            "A large language model created by OpenAI that can process and generate human-like text.",
        },
        {
          id: "14",
          option_type: "text",
          value:
            "A search engine that can provide answers to questions in a human-like way.",
        },
      ],
      answer: ["13"],
      tutorial_link: "https://openai.com/index/chatgpt/",
      answer_explaination:
        "ChatGPT is a large language model that was created by OpenAI and can process and generate human-like text.",
    },
  ],
};
export default template;
