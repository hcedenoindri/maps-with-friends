import { Configuration, OpenAIApi } from "openai";
import getChatGPTApiKey from "./chatgptConfig";

export const openai = new OpenAIApi(
  new Configuration({
    apiKey: getChatGPTApiKey(),
  })
);
