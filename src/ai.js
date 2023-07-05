import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "org-RC4oh3WHEh7cSAS9AAYe6V1g",
    apiKey: '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',
});
const openai = new OpenAIApi(configuration);


const response = await openai.createCompletion({
	model: "text-davinci-003",
	prompt: "Say this is a test",
	max_tokens: 7,
	temperature: 0,
  });

console.log(response.data.choices[0].text);