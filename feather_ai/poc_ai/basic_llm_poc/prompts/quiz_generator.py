prompt_template = '''
You are JSON template generator who generates template of quiz which consists of questions, options and correct answer.you should follow the template rules as shown in examples.
Note: return JSON template as a string.
Example:

Input 1:
Generate quiz on ChatGPT topic with 2 questions one should be single correct and one should be multiple correct.

Output 1:
{"quiz_title": "Knowledge check on ChatGPT",
"questions": [
  {
    "question_title": "What are some of the limitations of ChatGPT?",
    "choice_type": "multiple_choice",
    "options": [
      {
        "id": "e8aa4216",
        "option_type": "text",
        "value": "ChatGPT sometimes writes plausible-sounding but incorrect answers."
      },
      {
        "id": "77901222",
        "option_type": "text",
        "value": "ChatGPT is sensitive to tweaks to the input phrasing or attempting the same prompt multiple times."
      },
      {
        "id": "3c9f8363",
        "option_type": "text",
        "value": "None of the Above"
      }
    ],
    "answer": ["e8aa4216", "77901222"],
    "tutorial_link": "https://www.forbes.com/sites/bernardmarr/2023/03/03/the-top-10-limitations-of-chatgpt/?sh=441d55168f35",
    "answer_explaination": "ChatGPT is a large language model, but it is still under development. As a result, it has some limitations."
  },
  {
    "question_title": "What is ChatGPT?",
    "choice_type": "single_choice",
    "options": [
      {
        "id": "12",
        "option_type": "text",
        "value": "A chatbot that can hold conversations with humans."
      },
      {
        "id": "13",
        "option_type": "text",
        "value": "A large language model created by OpenAI that can process and generate human-like text."
      },
      {
        "id": "14",
        "option_type": "text",
        "value": "A search engine that can provide answers to questions in a human-like way."
      }
    ],
    "answer": ["13"],
    "tutorial_link": "https://openai.com/index/chatgpt/",
    "answer_explaination": "ChatGPT is a large language model that was created by OpenAI and can process and generate human-like text."
  }
]}

Input 2:
Generate quiz on simple interest and compound interest.
Output 2:
{"quiz_title": "Quiz on Simple and Compound Interest",
"questions": [
    {
      "question_title": "The difference in simple interest and compound interest on a certain sum of money in 2 years at 18 % p.a. is Rs. 162. The sum is",
      "choice_type": "single_choice",
      "options": [
        {
          "id": "1",
          "option_type": "text",
          "value": "Rs. 2500"
        },
        {
          "id": "2",
          "option_type": "text",
          "value": "Rs. 5000"
        },
        {
          "id": "3",
          "option_type": "text",
          "value": "None of the Above"
        }
      ],
      "answer": ["2"],
      "tutorial_link": "https://www.investopedia.com/articles/investing/020614/learn-simple-and-compound-interest.asp",
      "answer_explaination": "If Diff. between SI & CI for 2 years is Rs. x, Principal = x (100/r)2 P = 162 x (100x100)/(18x18) → P = 5000."
    }
  ]}

###
TEXT
"""
{TEXT}
"""
Output:
'''