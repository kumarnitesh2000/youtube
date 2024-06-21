import requests


class LLM:

  def __init__(self, llm_api_url, prompt_template):
    self.prompt_template = prompt_template
    self.llm_api_url = llm_api_url

  # prepare the final prompt using user query and prompt template
  def prepare_prompt(self, user_query,knowledge):
    final_prompt = self.prompt_template.replace("{TEXT}", user_query)
    final_prompt = self.prompt_template.replace("{KNOWLEDGE}", knowledge)
    return final_prompt

  # generate text using the prompt
  def generate_text(self, user_query,knowledge):
    final_prompt = self.prepare_prompt(user_query,knowledge)
    print(final_prompt)
    payload = {"prompt": {"text": final_prompt}}
    response = requests.post(self.llm_api_url, json=payload)
    response = response.json()
    if response.get("candidates"):
      output = response.get("candidates")[0].get("output")
      return output
