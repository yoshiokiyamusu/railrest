import { Configuration, OpenAIApi } from "openai";
import { Open_ai_organization, Open_ai_api_key, Youtube_key } from "./config.js";

const configuration = new Configuration({
    organization: Open_ai_organization,
    apiKey: Open_ai_api_key,
});
const openai = new OpenAIApi(configuration);


const response = await openai.createCompletion({
	model: "text-davinci-003",
	prompt: "Say this is a test",
	max_tokens: 7,
	temperature: 0,
  });

console.log(response.data.choices[0].text);