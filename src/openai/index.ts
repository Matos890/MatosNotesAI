import OpenAi from "openai";
const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API key here
});
export default openai;
