import { ChatOpenAI } from "@langchain/openai";

const LLM = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.5,
    maxRetries: 2,
    apiKey: process.env.OPENAI_API_KEY,
});

export default LLM;